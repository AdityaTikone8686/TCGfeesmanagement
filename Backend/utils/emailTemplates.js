const TEMPLATES = {
approved: (r) => [
'Registration approved',
Hi ${r.fname}, your registration (${r.refNum}) at Tikone Cricket Gurukul has been approved. We will contact you about batch and fee details.
],

rejected: (r) => [
'Registration update',
Hi ${r.fname}, we are unable to offer admission for registration ${r.refNum} at this time.${r.rejectionReason ? ' Reason: ' + r.rejectionReason : ''}
],

waitlisted: (r) => [
'You are on the waiting list',
Hi ${r.fname}, registration ${r.refNum} has been placed on our waiting list. We will contact you when a seat opens.
],

batch_assigned: (r) => [
'Batch assigned',
Hi ${r.fname}, you have been assigned to batch "${r.batchName}" (registration ${r.refNum}).
],

payment_instructions: (r) => [
'Payment instructions',
Hi ${r.fname}, please complete your admission fee payment for registration ${r.refNum} and share the payment proof with the academy.
],

payment_confirmed: (r) => [
'Payment confirmed',
Hi ${r.fname}, we have verified your payment for registration ${r.refNum}. Thank you!
],

admission_confirmed: (r) => [
'Admission confirmed',
Hi ${r.fname}, welcome to Tikone Cricket Gurukul! Your admission (${r.refNum}) is confirmed.
]
};

export default TEMPLATES;
