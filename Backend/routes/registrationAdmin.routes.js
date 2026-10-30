'use strict';

/**
 * Tikone Cricket Gurukul — Registration Admission Management
 *
 * Mount:
 * app.use('/api/admin/registrations', registrationAdminRoutes);
 *
 * Every route here is admin-only. Read SETUP.md first: it lists the schema fields
 * you must add to your existing models and the assumptions made about them.
 */

import express from 'express';
import mongoose from 'mongoose';
import crypto from 'node:crypto';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const { Schema } = mongoose;
const router = express.Router();

/* ===================================================================
   1. EXISTING ADMIN AUTHENTICATION
=================================================================== */

const canDelete = (user) =>
  user && (
    user.isAdmin === true ||
    user.role === 'admin' ||
    user.role === 'superadmin'
  );

/* ===================================================================
   2. Helpers
=================================================================== */

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const asyncH = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const clean = (v, max = 500) =>
  (typeof v === 'string' ? v.trim().slice(0, max) : '');

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const isId = (v) => mongoose.Types.ObjectId.isValid(v);

// Resolve your existing models lazily (names are tried in order).
const pick = (...names) => {
  for (const n of names) {
    if (mongoose.models[n]) return mongoose.models[n];
  }

  throw new HttpError(
    500,
    `Model not found (${names.join(' / ')}). Update the model names at the top of registrationAdmin.routes.js`
  );
};

const Reg = () => pick('Registration', 'Register');
const Student = () => pick('User', 'Student');
const FeePlan = () => pick('FeePlan');
const PayReq = () => pick('PaymentRequest');
const Payment = () => pick('Payment');
const Subscription = () => pick('Subscription');

async function tx(fn) {
  const session = await mongoose.startSession();

  try {
    let out;

    await session.withTransaction(async () => {
      out = await fn(session);
    });

    return out;
  } finally {
    await session.endSession();
  }
}

const actor = (req) => {
  const admin = req.admin || req.user;

  return {
    id: admin._id || admin.id,
    name: admin.name || admin.email || 'Administrator',
    email: admin.email || ''
  };
};

/* ===================================================================
   3. New collections (history + batches)
=================================================================== */

const historySchema = new Schema(
  {
    registration: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
      immutable: true
    },

    refNum: {
      type: String,
      immutable: true
    },

    action: {
      type: String,
      required: true,
      immutable: true
    },

    fromStatus: {
      type: String,
      immutable: true
    },

    toStatus: {
      type: String,
      immutable: true
    },

    by: {
      id: Schema.Types.ObjectId,
      name: String,
      email: String
    },

    remarks: {
      type: String,
      immutable: true
    },

    meta: {
      type: Schema.Types.Mixed,
      immutable: true
    },

    at: {
      type: Date,
      default: Date.now,
      immutable: true
    }
  },
  { versionKey: false }
);

// Audit trail is append-only: block every update/delete operation at the model level.
[
  'updateOne',
  'updateMany',
  'findOneAndUpdate',
  'findOneAndReplace',
  'replaceOne',
  'deleteOne',
  'deleteMany',
  'findOneAndDelete'
].forEach((op) =>
  historySchema.pre(op, function (next) {
    next(new Error('Registration history is append-only'));
  })
);

const History =
  mongoose.models.RegistrationHistory ||
  mongoose.model('RegistrationHistory', historySchema);

// If you already have a Batch model, delete this and make Batch resolve to yours.
// It needs: name, timing, capacity, enrolled, active.
const batchSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    timing: {
      type: String,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    capacity: {
      type: Number,
      required: true,
      min: 1
    },

    enrolled: {
      type: Number,
      default: 0,
      min: 0
    },

    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Batch =
  mongoose.models.Batch ||
  mongoose.model('Batch', batchSchema);

const Counter =
  mongoose.models.RegistrationCounter ||
  mongoose.model(
    'RegistrationCounter',
    new Schema({
      _id: String,
      seq: {
        type: Number,
        default: 0
      }
    })
  );

// ADAPT if your existing student ID format differs.
async function nextStudentId(session) {
  const year = new Date().getFullYear();

  const c = await Counter.findOneAndUpdate(
    { _id: `student-${year}` },
    { $inc: { seq: 1 } },
    {
      new: true,
      upsert: true,
      session
    }
  );

  return `TCG-${year}-${String(c.seq).padStart(4, '0')}`;
}

async function logHistory(
  session,
  reg,
  action,
  { from, to, remarks, meta } = {},
  req
) {
  await History.create(
    [
      {
        registration: reg._id,
        refNum: reg.refNum,
        action,
        fromStatus: from,
        toStatus: to,
        by: req ? actor(req) : undefined,
        remarks: clean(remarks || '', 1000),
        meta
      }
    ],
    { session }
  );
}

/* ===================================================================
   4. Status workflow (server is the source of truth)
=================================================================== */

const TRANSITIONS = {
  pending: ['under_review', 'approved', 'rejected', 'waitlisted'],
  under_review: ['approved', 'rejected', 'waitlisted'],
  waitlisted: ['under_review', 'approved', 'rejected'],
  rejected: ['under_review'],
  approved: ['payment_pending', 'rejected'],
  payment_pending: ['payment_submitted', 'rejected'],
  payment_submitted: ['payment_verified', 'payment_pending'],
  payment_verified: ['admission_confirmed'],
  admission_confirmed: []
};

const statusOf = (r) => r.status || 'pending';

function assertTransition(reg, to) {
  const from = statusOf(reg);

  if (!(TRANSITIONS[from] || []).includes(to)) {
    throw new HttpError(
      409,
      `Invalid status change: ${from.replace(/_/g, ' ')} → ${to.replace(/_/g, ' ')}`
    );
  }
}

const ACTION_TO_STATUS = {
  review: 'under_review',
  approve: 'approved',
  reject: 'rejected',
  waitlist: 'waitlisted',
  reopen: 'under_review'
};

const ACTION_LOG = {
  review: 'review_started',
  approve: 'approved',
  reject: 'rejected',
  waitlist: 'waitlisted',
  reopen: 'reopened'
};

async function getReg(id, session) {
  const q = Reg().findById(id);

  if (session) q.session(session);

  const reg = await q;

  if (!reg) {
    throw new HttpError(404, 'Registration not found');
  }

  return reg;
}

async function acquireSeat(batchId, session) {
  const b = await Batch.findOneAndUpdate(
    {
      _id: batchId,
      active: true,
      $expr: {
        $lt: ['$enrolled', '$capacity']
      }
    },
    {
      $inc: {
        enrolled: 1
      }
    },
    {
      new: true,
      session
    }
  );

  if (!b) {
    const exists = await Batch.findById(batchId).session(session);

    if (!exists) {
      throw new HttpError(404, 'Batch not found');
    }

    throw new HttpError(
      409,
      exists.active
        ? `Batch "${exists.name}" is full`
        : `Batch "${exists.name}" is not active`
    );
  }

  return b;
}

async function releaseSeat(batchId, session) {
  if (!batchId) return;

  await Batch.updateOne(
    {
      _id: batchId,
      enrolled: {
        $gt: 0
      }
    },
    {
      $inc: {
        enrolled: -1
      }
    },
    { session }
  );
}

/* ===================================================================
   5. Notifications (email via SMTP only when configured)
=================================================================== */

const TEMPLATES = {
  approved: (r) => [
    'Registration approved',
    `Hi ${r.fname}, your registration (${r.refNum}) at Tikone Cricket Gurukul has been approved. We will contact you about batch and fee details.`
  ],

  rejected: (r) => [
    'Registration update',
    `Hi ${r.fname}, we are unable to offer admission for registration ${r.refNum} at this time.${r.rejectionReason ? ' Reason: ' + r.rejectionReason : ''}`
  ],

  waitlisted: (r) => [
    'You are on the waiting list',
    `Hi ${r.fname}, registration ${r.refNum} has been placed on our waiting list. We will contact you when a seat opens.`
  ],

  batch_assigned: (r) => [
    'Batch assigned',
    `Hi ${r.fname}, you have been assigned to batch "${r.batchName}" (registration ${r.refNum}).`
  ],

  payment_instructions: (r) => [
    'Payment instructions',
    `Hi ${r.fname}, please complete your admission fee payment for registration ${r.refNum} and share the payment proof with the academy.`
  ],

  payment_confirmed: (r) => [
    'Payment confirmed',
    `Hi ${r.fname}, we have verified your payment for registration ${r.refNum}. Thank you!`
  ],

  admission_confirmed: (r) => [
    'Admission confirmed',
    `Hi ${r.fname}, welcome to Tikone Cricket Gurukul! Your admission (${r.refNum}) is confirmed.`
  ]
};

async function sendEmail(to, subject, text) {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    MAIL_FROM
  } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return {
      sent: false,
      reason: 'not_configured'
    };
  }

  let nodemailer;

  try {
    const nodemailerModule = await import('nodemailer');
    nodemailer = nodemailerModule.default || nodemailerModule;
  } catch {
    return {
      sent: false,
      reason: 'nodemailer_missing'
    };
  }

  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });

  await transport.sendMail({
    from: MAIL_FROM || SMTP_USER,
    to,
    subject,
    text
  });

  return {
    sent: true
  };
}

/* ===================================================================
   6. Routes — everything below requires an authenticated admin
=================================================================== */

router.use(protect, adminOnly);

router.param('id', (req, res, next, id) =>
  isId(id)
    ? next()
    : res.status(400).json({
        success: false,
        message: 'Invalid id'
      })
);

const PROTECTED = new Set([
  '_id',
  '__v',
  'refNum',
  'status',
  'statusUpdatedAt',
  'createdAt',
  'updatedAt',
  'adminRemarks',
  'assignedBatch',
  'batchName',
  'feePlan',
  'approvedBy',
  'approvedAt',
  'rejectedBy',
  'rejectedAt',
  'rejectionReason',
  'waitlistReason',
  'convertedStudent',
  'convertedAt'
]);

/* ---------- list + stats ---------- */

router.get('/', asyncH(async (req, res) => {
  const {
    search = '',
    status = '',
    batch = '',
    level = '',
    duration = '',
    from = '',
    to = '',
    sort = 'newest'
  } = req.query;

  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(
    Math.max(parseInt(req.query.limit, 10) || 10, 1),
    100
  );

  const R = Reg();
  const and = [];

  clean(search, 100)
    .split(/\s+/)
    .filter(Boolean)
    .forEach((t) => {
      const rx = new RegExp(esc(t), 'i');

      and.push({
        $or: [
          { fname: rx },
          { lname: rx },
          { phone: rx },
          { email: rx },
          { refNum: rx }
        ]
      });
    });

  if (status === 'pending') {
    and.push({
      $or: [
        { status: 'pending' },
        { status: { $exists: false } }
      ]
    });
  } else if (status === 'converted') {
    and.push({
      convertedStudent: {
        $exists: true,
        $ne: null
      }
    });
  } else if (TRANSITIONS[status]) {
    and.push({ status });
  }

  if (batch) {
    and.push({
      $or: [
        { batch },
        { batchName: batch }
      ]
    });
  }

  if (level) and.push({ level });
  if (duration) and.push({ duration });

  if (from || to) {
    const r = {};

    if (from && !isNaN(new Date(from))) {
      r.$gte = new Date(from);
    }

    if (to && !isNaN(new Date(to))) {
      const d = new Date(to);
      d.setHours(23, 59, 59, 999);
      r.$lte = d;
    }

    and.push({ createdAt: r });
  }

  const filter = and.length ? { $and: and } : {};

  const [
    rows,
    total,
    counts,
    batches,
    levels,
    durations
  ] = await Promise.all([
    R.find(filter)
      .sort({ createdAt: sort === 'oldest' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-__v')
      .lean(),

    R.countDocuments(filter),

    Promise.all([
      R.countDocuments({}),

      R.countDocuments({
        $or: [
          { status: 'pending' },
          { status: { $exists: false } }
        ]
      }),

      R.countDocuments({ status: 'approved' }),
      R.countDocuments({ status: 'rejected' }),
      R.countDocuments({ status: 'waitlisted' }),

      R.countDocuments({
        convertedStudent: {
          $exists: true,
          $ne: null
        }
      }),

      R.countDocuments({ status: 'payment_pending' })
    ]),

    R.distinct('batch'),
    R.distinct('level'),
    R.distinct('duration')
  ]);

  res.json({
    success: true,

    data: rows.map((r) => ({
      ...r,
      status: r.status || 'pending'
    })),

    pagination: {
      page,
      limit,
      total,
      pages: Math.max(Math.ceil(total / limit), 1)
    },

    stats: {
      total: counts[0],
      pending: counts[1],
      approved: counts[2],
      rejected: counts[3],
      waitlisted: counts[4],
      converted: counts[5],
      paymentPending: counts[6]
    },

    filters: {
      batches: batches.filter(Boolean).sort(),
      levels: levels.filter(Boolean).sort(),
      durations: durations.filter(Boolean).sort()
    },

    permissions: {
      canDelete: canDelete(req.user),
      canManageBatches: true
    }
  });
}));

/* ---------- meta: batches + fee plans (declared before /:id) ---------- */

router.get('/meta/batches', asyncH(async (req, res) => {
  const list = await Batch.find({
    active: true
  })
    .sort({ name: 1 })
    .lean();

  res.json({
    success: true,

    data: list.map((b) => ({
      ...b,
      available: Math.max(b.capacity - b.enrolled, 0)
    }))
  });
}));

router.post('/meta/batches', asyncH(async (req, res) => {
  const name = clean(req.body.name, 80);
  const capacity = parseInt(req.body.capacity, 10);

  if (!name) {
    throw new HttpError(422, 'Batch name is required');
  }

  if (!Number.isInteger(capacity) || capacity < 1 || capacity > 500) {
    throw new HttpError(422, 'Capacity must be between 1 and 500');
  }

  try {
    const b = await Batch.create({
      name,
      timing: clean(req.body.timing, 80),
      description: clean(req.body.description, 200),
      capacity
    });

    res.status(201).json({
      success: true,

      data: {
        ...b.toObject(),
        available: capacity
      },

      message: 'Batch created'
    });
  } catch (e) {
    if (e.code === 11000) {
      throw new HttpError(409, 'A batch with this name already exists');
    }

    throw e;
  }
}));

router.get('/meta/fee-plans', asyncH(async (req, res) => {
  const plans = await FeePlan()
    .find({})
    .sort({ amount: 1 })
    .lean();

  res.json({
    success: true,
    data: plans
  });
}));

/* ---------- single registration ---------- */

router.get('/:id', asyncH(async (req, res) => {
  const reg = await getReg(req.params.id);

  const [
    history,
    payments,
    dupes
  ] = await Promise.all([
    History.find({
      registration: reg._id
    })
      .sort({ at: 1 })
      .lean(),

    PayReq()
      .find({
        registration: reg._id
      })
      .sort({ createdAt: -1 })
      .populate('feePlan', 'planName amount durationInDays')
      .lean(),

    Reg().find({
      _id: { $ne: reg._id },

      $or: [
        reg.email ? { email: reg.email } : null,
        reg.phone ? { phone: reg.phone } : null
      ].filter(Boolean)
    })
      .select('refNum fname lname status createdAt')
      .limit(5)
      .lean()
  ]);

  const timeline = history.some((h) => h.action === 'submitted')
    ? history
    : [
        {
          _id: 'virtual-submitted',
          action: 'submitted',
          toStatus: 'pending',
          at: reg.createdAt,
          by: { name: 'Applicant' },
          virtual: true
        },
        ...history
      ];

  const editableFields = Object.entries(Reg().schema.paths)
    .filter(([k, p]) =>
      !PROTECTED.has(k) &&
      !k.includes('.') &&
      ['String', 'Number', 'Date', 'Boolean'].includes(p.instance)
    )
    .map(([key, p]) => ({
      key,
      type: p.instance,
      required: !!p.isRequired,
      options: p.enumValues && p.enumValues.length
        ? p.enumValues
        : undefined
    }));

  let assignedBatch = null;

  if (reg.assignedBatch) {
    assignedBatch = await Batch.findById(reg.assignedBatch).lean();
  }

  res.json({
    success: true,

    data: {
      registration: {
        ...reg.toObject(),
        status: statusOf(reg)
      },

      history: timeline,
      payments,
      duplicates: dupes,
      editableFields,
      assignedBatch
    }
  });
}));

router.get('/:id/history', asyncH(async (req, res) => {
  const history = await History.find({
    registration: req.params.id
  })
    .sort({ at: 1 })
    .lean();

  res.json({
    success: true,
    data: history
  });
}));

/* ---------- edit details ---------- */

router.patch('/:id', asyncH(async (req, res) => {
  const changes = req.body && typeof req.body === 'object'
    ? req.body
    : {};

  const out = await tx(async (session) => {
    const reg = await getReg(req.params.id, session);

    if (
      statusOf(reg) === 'admission_confirmed' ||
      reg.convertedStudent
    ) {
      throw new HttpError(
        409,
        'This registration is already a student. Edit the student record instead.'
      );
    }

    const diff = {};

    for (const [k, raw] of Object.entries(changes)) {
      const path = Reg().schema.paths[k];

      if (
        PROTECTED.has(k) ||
        !path ||
        k.includes('.') ||
        !['String', 'Number', 'Date', 'Boolean'].includes(path.instance)
      ) {
        continue;
      }

      let v = raw;

      if (path.instance === 'String') {
        v = clean(String(raw ?? ''), 500);
      }

      if (
        k === 'email' &&
        v &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
      ) {
        throw new HttpError(422, 'Invalid email address');
      }

      if (
        k === 'phone' &&
        v &&
        !/^[0-9+\-\s()]{7,18}$/.test(v)
      ) {
        throw new HttpError(422, 'Invalid phone number');
      }

      if (
        path.instance === 'Number' &&
        raw !== '' &&
        !Number.isFinite(Number(raw))
      ) {
        throw new HttpError(422, `${k} must be a number`);
      }

      if (String(reg[k] ?? '') === String(v ?? '')) {
        continue;
      }

      diff[k] = {
        from: reg[k] ?? null,
        to: v === '' ? null : v
      };

      reg.set(k, v === '' ? undefined : v);
    }

    if (!Object.keys(diff).length) {
      throw new HttpError(400, 'No changes to save');
    }

    await reg.validate();
    await reg.save({ session });

    await logHistory(
      session,
      reg,
      'edited',
      {
        meta: {
          changes: diff
        }
      },
      req
    );

    return reg;
  });

  res.json({
    success: true,
    data: out,
    message: 'Registration updated'
  });
}));

/* ---------- status actions: review / approve / reject / waitlist / reopen ---------- */

router.post('/:id/status', asyncH(async (req, res) => {
  const {
    action,
    reason = '',
    remarks = ''
  } = req.body || {};

  const to = ACTION_TO_STATUS[action];

  if (!to) {
    throw new HttpError(400, 'Invalid action');
  }

  if (
    (action === 'reject' || action === 'waitlist') &&
    clean(reason, 500).length < 3
  ) {
    throw new HttpError(422, 'A reason is required');
  }

  const reg = await tx(async (session) => {
    const r = await getReg(req.params.id, session);

    assertTransition(r, to);

    const from = statusOf(r);
    const by = actor(req);

    if (to === 'rejected' || to === 'waitlisted') {
      if (r.assignedBatch) {
        await releaseSeat(r.assignedBatch, session);
        r.assignedBatch = undefined;
        r.batchName = undefined;
      }

      await PayReq().updateMany(
        {
          registration: r._id,
          status: 'pending'
        },
        {
          $set: {
            status: 'rejected',
            rejectionReason: `Registration ${to}`
          }
        },
        { session }
      );
    }

    r.status = to;
    r.statusUpdatedAt = new Date();

    if (clean(remarks, 1000)) {
      r.adminRemarks = clean(remarks, 1000);
    }

    if (to === 'approved') {
      r.approvedBy = by;
      r.approvedAt = new Date();
      r.rejectionReason = undefined;
    }

    if (to === 'rejected') {
      r.rejectedBy = by;
      r.rejectedAt = new Date();
      r.rejectionReason = clean(reason, 500);
    }

    if (to === 'waitlisted') {
      r.waitlistReason = clean(reason, 500);
    }

    await r.save({ session });

    await logHistory(
      session,
      r,
      ACTION_LOG[action],
      {
        from,
        to,

        remarks: clean(reason, 500)
          ? `${clean(reason, 500)}${remarks ? ' — ' + clean(remarks, 500) : ''}`
          : remarks
      },
      req
    );

    return r;
  });

  res.json({
    success: true,
    data: reg,
    message: `Registration ${to.replace(/_/g, ' ')}`
  });
}));

/* ---------- batch assignment ---------- */

router.put('/:id/batch', asyncH(async (req, res) => {
  const { batchId } = req.body || {};

  if (!isId(batchId)) {
    throw new HttpError(422, 'Select a batch');
  }

  const out = await tx(async (session) => {
    const reg = await getReg(req.params.id, session);

    if (
      ![
        'approved',
        'payment_pending',
        'payment_submitted',
        'payment_verified'
      ].includes(statusOf(reg))
    ) {
      throw new HttpError(
        409,
        'Approve the registration before assigning a batch'
      );
    }

    if (String(reg.assignedBatch) === String(batchId)) {
      return {
        reg,
        unchanged: true
      };
    }

    const newBatch = await acquireSeat(batchId, session);

    const prev = reg.assignedBatch;
    const prevName = reg.batchName;

    if (prev) {
      await releaseSeat(prev, session);
    }

    reg.assignedBatch = newBatch._id;
    reg.batchName = newBatch.name;

    await reg.save({ session });

    await logHistory(
      session,
      reg,
      prev ? 'batch_changed' : 'batch_assigned',
      {
        remarks: prev
          ? `${prevName} → ${newBatch.name}`
          : newBatch.name,

        meta: {
          batchId: newBatch._id
        }
      },
      req
    );

    return { reg };
  });

  res.json({
    success: true,
    data: out.reg,
    message: out.unchanged ? 'Batch unchanged' : 'Batch assigned'
  });
}));

/* ---------- payments (reuses your PaymentRequest + FeePlan) ---------- */

router.post('/:id/payment-request', asyncH(async (req, res) => {
  const {
    feePlanId,
    notes = ''
  } = req.body || {};

  if (!isId(feePlanId)) {
    throw new HttpError(422, 'Select a fee plan');
  }

  const out = await tx(async (session) => {
    const reg = await getReg(req.params.id, session);
    const from = statusOf(reg);

    if (!['approved', 'payment_pending'].includes(from)) {
      throw new HttpError(
        409,
        'Registration must be approved before requesting payment'
      );
    }

    if (!reg.assignedBatch) {
      throw new HttpError(
        409,
        'Assign a batch before creating a payment request'
      );
    }

    const open = await PayReq()
      .findOne({
        registration: reg._id,
        status: 'pending'
      })
      .session(session);

    if (open) {
      throw new HttpError(
        409,
        'There is already an open payment request for this registration'
      );
    }

    const plan = await FeePlan()
      .findById(feePlanId)
      .session(session);

    if (!plan) {
      throw new HttpError(404, 'Fee plan not found');
    }

    const [pr] = await PayReq().create(
      [
        {
          registration: reg._id,
          feePlan: plan._id,
          amount: plan.amount,
          status: 'pending',
          description: `Admission fee — ${plan.planName} (${reg.refNum})`,
          adminNotes: clean(notes, 500),
          createdByAdmin: actor(req)
        }
      ],
      { session }
    );

    reg.feePlan = plan._id;

    if (from === 'approved') {
      reg.status = 'payment_pending';
      reg.statusUpdatedAt = new Date();
    }

    await reg.save({ session });

    await logHistory(
      session,
      reg,
      'payment_request_created',
      {
        from,
        to: 'payment_pending',
        remarks: `${plan.planName} — ₹${plan.amount}`,

        meta: {
          paymentRequest: pr._id
        }
      },
      req
    );

    return pr;
  });

  res.status(201).json({
    success: true,
    data: out,
    message: 'Payment request created'
  });
}));

// Admin records the proof on behalf of the applicant (screenshot and/or receipt/transaction reference).
// This NEVER verifies the payment.

router.post('/:id/payment/proof', asyncH(async (req, res) => {
  const {
    paymentRequestId,
    screenshot,
    transactionId = ''
  } = req.body || {};

  if (!isId(paymentRequestId)) {
    throw new HttpError(422, 'Invalid payment request');
  }

  const txn = clean(transactionId, 100);

  if (!screenshot && !txn) {
    throw new HttpError(
      422,
      'Provide a payment screenshot or a transaction/receipt reference'
    );
  }

  if (
    screenshot &&
    (!/^data:image\/(png|jpe?g|webp);base64,/.test(screenshot) ||
      screenshot.length > 2.6 * 1024 * 1024)
  ) {
    throw new HttpError(
      422,
      'Screenshot must be a PNG/JPG/WebP image under ~1.9 MB'
    );
  }

  await tx(async (session) => {
    const reg = await getReg(req.params.id, session);
    const from = statusOf(reg);

    if (!['payment_pending', 'payment_submitted'].includes(from)) {
      throw new HttpError(409, 'Payment is not awaiting proof');
    }

    const pr = await PayReq()
      .findOne({
        _id: paymentRequestId,
        registration: reg._id,
        status: 'pending'
      })
      .session(session);

    if (!pr) {
      throw new HttpError(404, 'Open payment request not found');
    }

    if (screenshot) {
      pr.screenshot = screenshot;
    }

    if (txn) {
      pr.transactionId = txn;
    }

    pr.proofSubmittedAt = new Date();
    pr.proofRecordedBy = actor(req);

    await pr.save({ session });

    if (from === 'payment_pending') {
      reg.status = 'payment_submitted';
      reg.statusUpdatedAt = new Date();

      await reg.save({ session });
    }

    await logHistory(
      session,
      reg,
      'payment_proof_recorded',
      {
        from,
        to: 'payment_submitted',
        remarks: txn || 'Screenshot attached',

        meta: {
          paymentRequest: pr._id
        }
      },
      req
    );
  });

  res.json({
    success: true,
    message: 'Payment proof recorded. It still needs to be verified.'
  });
}));

router.post('/:id/payment/verify', asyncH(async (req, res) => {
  const {
    paymentRequestId,
    transactionId = '',
    remarks = ''
  } = req.body || {};

  if (!isId(paymentRequestId)) {
    throw new HttpError(422, 'Invalid payment request');
  }

  await tx(async (session) => {
    const reg = await getReg(req.params.id, session);

    assertTransition(reg, 'payment_verified');

    const pr = await PayReq()
      .findOne({
        _id: paymentRequestId,
        registration: reg._id,
        status: 'pending'
      })
      .session(session);

    if (!pr || !pr.proofSubmittedAt) {
      throw new HttpError(
        409,
        'No submitted proof to verify for this payment request'
      );
    }

    pr.status = 'approved';
    pr.transactionId = clean(transactionId, 100) || pr.transactionId;
    pr.adminNotes = clean(remarks, 500) || pr.adminNotes;
    pr.verifiedBy = actor(req);
    pr.verifiedAt = new Date();

    await pr.save({ session });

    reg.status = 'payment_verified';
    reg.statusUpdatedAt = new Date();

    await reg.save({ session });

    await logHistory(
      session,
      reg,
      'payment_verified',
      {
        from: 'payment_submitted',
        to: 'payment_verified',
        remarks: pr.transactionId,

        meta: {
          paymentRequest: pr._id
        }
      },
      req
    );
  });

  res.json({
    success: true,
    message: 'Payment verified'
  });
}));

router.post('/:id/payment/reject', asyncH(async (req, res) => {
  const {
    paymentRequestId,
    reason = ''
  } = req.body || {};

  if (!isId(paymentRequestId)) {
    throw new HttpError(422, 'Invalid payment request');
  }

  if (clean(reason, 500).length < 3) {
    throw new HttpError(422, 'A rejection reason is required');
  }

  await tx(async (session) => {
    const reg = await getReg(req.params.id, session);

    assertTransition(reg, 'payment_pending');

    const pr = await PayReq()
      .findOne({
        _id: paymentRequestId,
        registration: reg._id,
        status: 'pending'
      })
      .session(session);

    if (!pr) {
      throw new HttpError(404, 'Open payment request not found');
    }

    pr.status = 'rejected';
    pr.rejectionReason = clean(reason, 500);
    pr.rejectedBy = actor(req);
    pr.rejectedAt = new Date();

    await pr.save({ session });

    reg.status = 'payment_pending';
    reg.statusUpdatedAt = new Date();

    await reg.save({ session });

    await logHistory(
      session,
      reg,
      'payment_rejected',
      {
        from: 'payment_submitted',
        to: 'payment_pending',
        remarks: clean(reason, 500)
      },
      req
    );
  });

  res.json({
    success: true,
    message: 'Payment rejected. Create a new payment request to continue.'
  });
}));

/* ---------- convert to student (transactional + idempotent) ---------- */

router.post('/:id/convert', asyncH(async (req, res) => {
  const {
    skipPayment = false,
    remarks = ''
  } = req.body || {};

  const out = await tx(async (session) => {
    const reg = await getReg(req.params.id, session);
    const S = Student();

    // Idempotent: second click returns the existing student, never creates another.
    if (reg.convertedStudent) {
      const s = await S.findById(reg.convertedStudent)
        .session(session)
        .select('name email studentId');

      return {
        already: true,
        student: s
      };
    }

    const st = statusOf(reg);

    if (!reg.assignedBatch) {
      throw new HttpError(
        409,
        'Assign a batch before converting to a student'
      );
    }

    if (st === 'approved') {
      if (skipPayment !== true) {
        throw new HttpError(
          409,
          'Payment has not been verified. Request and verify payment, or explicitly confirm admission without a payment.'
        );
      }

      if (
        await PayReq()
          .findOne({
            registration: reg._id,
            status: 'pending'
          })
          .session(session)
      ) {
        throw new HttpError(
          409,
          'An open payment request exists. Verify or reject it first.'
        );
      }
    } else if (st !== 'payment_verified') {
      throw new HttpError(
        409,
        `Cannot convert a registration that is ${st.replace(/_/g, ' ')}`
      );
    }

    if (!reg.email) {
      throw new HttpError(
        422,
        'Registration has no email address — add one before converting'
      );
    }

    if (!reg.phone) {
     throw new HttpError(
       422,
       'Registration has no phone number — add one before converting'
     );
   }

    const email = reg.email.toLowerCase().trim();

    const or = [{ email }];

    if (reg.phone) {
      or.push({ phone: reg.phone });
    }

    const dup = await S.findOne({
      $or: or
    }).session(session);

    if (dup && String(dup.registration) !== String(reg._id)) {
      throw new HttpError(
        409,
        `A student with the same email/phone already exists (${dup.name}). Resolve the duplicate first.`
      );
    }

    let student = dup;
    let tempPassword;

    if (!student) {
      tempPassword = crypto.randomBytes(6).toString('base64url');

      const studentId = await nextStudentId(session);

      [student] = await S.create(
        [
          {
            name: `${reg.fname} ${reg.lname || ''}`.trim(),
            email,
            phone: reg.phone,
            password: tempPassword,
            role: 'user',
            status: 'active',
            studentId,
            registration: reg._id,
            registrationRef: reg.refNum,
            batch: reg.batchName,
            assignedBatch: reg.assignedBatch
          }
        ],
        { session }
      );
    }

    const now = new Date();

const paid = await PayReq()
  .findOne({
    registration: reg._id,
    status: 'approved'
  })
  .session(session);

let payment = null;
let subscription = null;

if (paid) {
  paid.user = student._id;

  await paid.save({ session });

  const rawMethod = String(
    paid.paymentMethod || 'online'
  ).toLowerCase();

  const method = ['cash', 'online', 'upi'].includes(rawMethod)
    ? rawMethod
    : 'online';

  [payment] = await Payment().create(
    [
      {
        user: student._id,
        email,
        amount: paid.amount,
        method,
        description: `Admission fee (${reg.refNum})`,
        transactionId: paid.transactionId || ''
      }
    ],
    { session }
  );
}

if (reg.feePlan) {
  const plan = await FeePlan()
    .findById(reg.feePlan)
    .session(session);

  if (plan) {
    [subscription] = await Subscription().create(
      [
        {
          user: student._id,
          plan: plan._id,
          startDate: now,
          endDate: new Date(
            now.getTime() + plan.durationInDays * 86400000
          ),
          payment: payment ? payment._id : undefined,
          status: 'active'
        }
      ],
      { session }
    );

    if (payment) {
      payment.subscription = subscription._id;
      await payment.save({ session });
    }

    student.activeSubscription = subscription._id;
    await student.save({ session });
  }
}
    // Confirm admission and link the registration to the student.
    reg.status = 'admission_confirmed';
    reg.statusUpdatedAt = new Date();
    reg.convertedStudent = student._id;
    reg.convertedAt = new Date();

    await reg.save({ session });

    // Record the conversion in the registration history.
    await logHistory(
      session,
      reg,
      'converted_to_student',
      {
        from: st,
        to: 'admission_confirmed',
        remarks: clean(remarks, 500) || 'Registration converted to student',
        meta: {
          studentId: student.studentId,
          student: student._id,
          payment: payment?._id || null,
          subscription: subscription?._id || null,
          skipPayment: skipPayment === true
        }
      },
      req
    );

    return {
      already: false,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        studentId: student.studentId
      },
      temporaryPassword: tempPassword || null,
      payment,
      subscription
    };
  });

  res.status(out.already ? 200 : 201).json({
    success: true,
    data: out,
    message: out.already
      ? 'Student already exists for this registration'
      : 'Registration successfully converted to student'
  });
}));

/* ---------- notifications ---------- */

router.post('/:id/notify', asyncH(async (req, res) => {
  const { type } = req.body || {};

  if (!TEMPLATES[type]) {
    throw new HttpError(400, 'Unknown notification type');
  }

  const reg = await getReg(req.params.id);

  if (!reg.email) {
    throw new HttpError(
      422,
      'This registration has no email address'
    );
  }

  const [subject, text] = TEMPLATES[type](reg);

  const result = await sendEmail(
    reg.email,
    `Tikone Cricket Gurukul — ${subject}`,
    text
  );

  if (!result.sent) {
    return res.status(501).json({
      success: false,
      code: result.reason,
      message: 'Email is not configured on the server (set SMTP_* variables and install nodemailer). Nothing was sent.'
    });
  }

  await tx(async (session) =>
    logHistory(
      session,
      reg,
      'notification_sent',
      {
        remarks: `${type} → ${reg.email}`
      },
      req
    )
  );

  res.json({
    success: true,
    message: `Email sent to ${reg.email}`
  });
}));

/* ---------- delete (confirmation + reason, audit kept) ---------- */

router.delete('/:id', asyncH(async (req, res) => {
  if (!canDelete(req.user)) {
    throw new HttpError(
      403,
      'You are not allowed to delete registrations'
    );
  }

  const reason = clean(req.body?.reason, 500);

  if (reason.length < 3) {
    throw new HttpError(422, 'A reason is required');
  }

  await tx(async (session) => {
    const reg = await getReg(req.params.id, session);

    if (reg.convertedStudent) {
      throw new HttpError(
        409,
        'This registration was converted to a student and cannot be deleted'
      );
    }

    if (reg.assignedBatch) {
      await releaseSeat(reg.assignedBatch, session);
    }

    await PayReq().updateMany(
      {
        registration: reg._id,
        status: 'pending'
      },
      {
        $set: {
          status: 'rejected',
          rejectionReason: 'Registration deleted'
        }
      },
      { session }
    );

    await logHistory(
      session,
      reg,
      'deleted',
      {
        from: statusOf(reg),
        remarks: reason,

        meta: {
          snapshot: {
            name: `${reg.fname} ${reg.lname || ''}`.trim(),
            phone: reg.phone,
            email: reg.email
          }
        }
      },
      req
    );

    await Reg().deleteOne(
      {
        _id: reg._id
      },
      { session }
    );
  });

  res.json({
    success: true,
    message: 'Registration deleted'
  });
}));

/* ---------- consistent error responses ---------- */

// eslint-disable-next-line no-unused-vars
router.use((err, req, res, next) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      success: false,
      message: err.message
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(422).json({
      success: false,
      message: Object.values(err.errors)
        .map((e) => e.message)
        .join('. ')
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid value supplied'
    });
  }

  console.error('[registrations]', err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Something went wrong. Please try again.'
  });
});

export default router;
