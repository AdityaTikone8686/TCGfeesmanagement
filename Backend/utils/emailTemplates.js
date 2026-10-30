const TEMPLATES = {
approved: (r) => [
'Registration approved',
`Hi ${r.fname},

Your registration (${r.refNum}) at Tikone Cricket Gurukul has been approved.

We will contact you about batch and fee details.

Thank you,
Tikone Cricket Gurukul`
],

rejected: (r) => [
'Registration update',
`Hi ${r.fname},

We are unable to offer admission for registration ${r.refNum} at this time.${r.rejectionReason ? ' Reason: ' + r.rejectionReason : ''}

Thank you,
Tikone Cricket Gurukul`
],

waitlisted: (r) => [
'You are on the waiting list',
`Hi ${r.fname},

Registration ${r.refNum} has been placed on our waiting list.

We will contact you when a seat opens.

Thank you,
Tikone Cricket Gurukul`
],

batch_assigned: (r) => [
'Batch assigned',
`Hi ${r.fname},

You have been assigned to batch "${r.batchName}" (registration ${r.refNum}).

Thank you,
Tikone Cricket Gurukul`
],

payment_instructions: (r) => [
'Payment instructions',
`Hi ${r.fname},

Please complete your admission fee payment for registration ${r.refNum} and share the payment proof with the academy.

Thank you,
Tikone Cricket Gurukul`
],

payment_confirmed: (r) => [
'Payment confirmed',
`Hi ${r.fname},

We have verified your payment for registration ${r.refNum}.

Thank you for choosing Tikone Cricket Gurukul!

Regards,
Tikone Cricket Gurukul`
],

admission_confirmed: (r) => [
'Admission confirmed',
`Hi ${r.fname},

Welcome to Tikone Cricket Gurukul!

Your admission (${r.refNum}) is confirmed.

We look forward to seeing you at the academy.

Regards,
Tikone Cricket Gurukul`
]
};

export default TEMPLATES;
