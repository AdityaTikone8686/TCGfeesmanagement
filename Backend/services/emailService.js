export async function sendEmail(to, subject, text) {
const {
EMAIL_SERVICE_URL,
EMAIL_SERVICE_API_KEY
} = process.env;

if (!EMAIL_SERVICE_URL || !EMAIL_SERVICE_API_KEY) {
return {
sent: false,
reason: 'email_service_not_configured'
};
}

try {
const response = await fetch(EMAIL_SERVICE_URL, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'x-email-api-key': EMAIL_SERVICE_API_KEY
},
body: JSON.stringify({
to,
subject,
text
}),
signal: AbortSignal.timeout(30000)
});


const result = await response.json();

if (!response.ok || !result.success) {
  console.error('Email service error:', result);

  return {
    sent: false,
    reason: 'email_delivery_failed'
  };
}

return {
  sent: true
};


} catch (error) {
console.error('Email service connection error:', error.message);


return {
  sent: false,
  reason: 'email_service_unavailable'
};


}
}
