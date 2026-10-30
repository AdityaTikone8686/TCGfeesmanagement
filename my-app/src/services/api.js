const API_BASE_URL = "https://tikonecricketgurukulbackend.onrender.com/api";

// =====================================================
// HELPER FUNCTIONS
// =====================================================

// Handle API responses
const handleResponse = async (response) => {
let data = null;

try {
	data = await response.json();
} catch {
	data = null;
}

if (!response.ok) {
	throw new Error(
		data?.message ||
		data?.error ||
		`HTTP error! status: ${response.status}`
	);
}

return data || {
	success: true,
	message: "Operation completed successfully",
};


};

// Authentication headers
const getAuthHeaders = (token) => ({
"Content-Type": "application/json",
...(token && { authorization: `Bearer ${token}` }),
});

// =====================================================
// AUTHENTICATION APIs
// =====================================================

export const authAPI = {
// User login
loginUser: async (credentials) => {
const response = await fetch(`${API_BASE_URL}/user/login`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(credentials),
});


	return handleResponse(response);
},

// Get user status
getUserStatus: async (token) => {
	const response = await fetch(`${API_BASE_URL}/user/status`, {
		method: "GET",
		headers: getAuthHeaders(token),
	});

	return handleResponse(response);
},

// Admin registration
registerAdmin: async (adminData, token) => {
	const response = await fetch(`${API_BASE_URL}/admin/register`, {
		method: "POST",
		headers: getAuthHeaders(token),
		body: JSON.stringify(adminData),
	});

	return handleResponse(response);
},

// Admin login
loginAdmin: async (credentials) => {
	const response = await fetch(`${API_BASE_URL}/admin/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(credentials),
	});

	return handleResponse(response);
},

// Get admin status
getAdminStatus: async (token) => {
	const response = await fetch(`${API_BASE_URL}/admin/status`, {
		method: "GET",
		headers: getAuthHeaders(token),
	});

	return handleResponse(response);
},


};

// =====================================================
// ADMIN APIs
// =====================================================

export const adminAPI = {
getAllStudents: async (token) => {
const response = await fetch(`${API_BASE_URL}/admin/students`, {
method: "GET",
headers: getAuthHeaders(token),
});


	return handleResponse(response);
},

addStudent: async (token, studentData) => {
	const response = await fetch(`${API_BASE_URL}/admin/students`, {
		method: "POST",
		headers: getAuthHeaders(token),
		body: JSON.stringify(studentData),
	});

	return handleResponse(response);
},

updateStudent: async (token, studentId, studentData) => {
	const response = await fetch(
		`${API_BASE_URL}/admin/students/${studentId}`,
		{
			method: "PUT",
			headers: getAuthHeaders(token),
			body: JSON.stringify(studentData),
		}
	);

	return handleResponse(response);
},

deleteStudent: async (token, studentId) => {
	const response = await fetch(
		`${API_BASE_URL}/admin/students/${studentId}`,
		{
			method: "DELETE",
			headers: getAuthHeaders(token),
		}
	);

	return handleResponse(response);
},

getAllPayments: async (token) => {
	const response = await fetch(`${API_BASE_URL}/admin/payments`, {
		method: "GET",
		headers: getAuthHeaders(token),
	});

	return handleResponse(response);
},

getAllFeePlans: async (token) => {
	const response = await fetch(`${API_BASE_URL}/admin/feeplans`, {
		method: "GET",
		headers: getAuthHeaders(token),
	});

	return handleResponse(response);
},

updatePassword: async (token, passwordData) => {
	const response = await fetch(`${API_BASE_URL}/admin/password`, {
		method: "PUT",
		headers: getAuthHeaders(token),
		body: JSON.stringify(passwordData),
	});

	return handleResponse(response);
},


};

// =====================================================
// FEE PLAN APIs
// =====================================================

export const feePlansAPI = {
createFeePlan: async (token, feePlanData) => {
const response = await fetch(`${API_BASE_URL}/feeplans`, {
method: "POST",
headers: getAuthHeaders(token),
body: JSON.stringify(feePlanData),
});


	return handleResponse(response);
},

getAllFeePlans: async (token) => {
	const response = await fetch(`${API_BASE_URL}/feeplans`, {
		method: "GET",
		headers: getAuthHeaders(token),
	});

	return handleResponse(response);
},

updateFeePlan: async (token, feePlanId, feePlanData) => {
	const response = await fetch(
		`${API_BASE_URL}/feeplans/${feePlanId}`,
		{
			method: "PUT",
			headers: getAuthHeaders(token),
			body: JSON.stringify(feePlanData),
		}
	);

	return handleResponse(response);
},

deleteFeePlan: async (token, feePlanId) => {
	const response = await fetch(
		`${API_BASE_URL}/feeplans/${feePlanId}`,
		{
			method: "DELETE",
			headers: getAuthHeaders(token),
		}
	);

	return handleResponse(response);
},


};

// =====================================================
// PAYMENT APIs
// =====================================================

export const paymentsAPI = {
addPayment: async (token, paymentData) => {
const response = await fetch(`${API_BASE_URL}/payments`, {
method: "POST",
headers: getAuthHeaders(token),
body: JSON.stringify(paymentData),
});


	return handleResponse(response);
},

getAllPayments: async (token) => {
	const response = await fetch(`${API_BASE_URL}/admin/payments`, {
		method: "GET",
		headers: getAuthHeaders(token),
	});

	return handleResponse(response);
},

getPaymentsByUserId: async (token, userId) => {
	const response = await fetch(
		`${API_BASE_URL}/payments/by-user/${userId}`,
		{
			method: "GET",
			headers: getAuthHeaders(token),
		}
	);

	return handleResponse(response);
},

getPaymentsByEmail: async (token, email) => {
	const response = await fetch(
		`${API_BASE_URL}/payments/by-email/${encodeURIComponent(email)}`,
		{
			method: "GET",
			headers: getAuthHeaders(token),
		}
	);

	return handleResponse(response);
},

updatePayment: async (token, paymentId, paymentData) => {
	const response = await fetch(
		`${API_BASE_URL}/payments/${paymentId}`,
		{
			method: "PUT",
			headers: getAuthHeaders(token),
			body: JSON.stringify(paymentData),
		}
	);

	return handleResponse(response);
},

deletePayment: async (token, paymentId) => {
	const response = await fetch(
		`${API_BASE_URL}/payments/${paymentId}`,
		{
			method: "DELETE",
			headers: getAuthHeaders(token),
		}
	);

	return handleResponse(response);
},


};

// =====================================================
// SUBSCRIPTION APIs
// =====================================================

export const subscriptionsAPI = {
createSubscription: async (token, subscriptionData) => {
const response = await fetch(`${API_BASE_URL}/subscriptions`, {
method: "POST",
headers: getAuthHeaders(token),
body: JSON.stringify(subscriptionData),
});


	return handleResponse(response);
},

getAllSubscriptions: async (token) => {
	const response = await fetch(`${API_BASE_URL}/subscriptions`, {
		method: "GET",
		headers: getAuthHeaders(token),
	});

	return handleResponse(response);
},

getSubscriptionById: async (token, subscriptionId) => {
	const response = await fetch(
		`${API_BASE_URL}/subscriptions/${subscriptionId}`,
		{
			method: "GET",
			headers: getAuthHeaders(token),
		}
	);

	return handleResponse(response);
},

getUserSubscriptions: async (token) => {
	const response = await fetch(`${API_BASE_URL}/subscriptions/user`, {
		method: "GET",
		headers: getAuthHeaders(token),
	});

	return handleResponse(response);
},

getAllFeePlansPublic: async () => {
	const response = await fetch(`${API_BASE_URL}/feeplans/public`, {
		method: "GET",
	});

	return handleResponse(response);
},

updateSubscription: async (token, subscriptionId, subscriptionData) => {
	const response = await fetch(
		`${API_BASE_URL}/subscriptions/${subscriptionId}`,
		{
			method: "PUT",
			headers: getAuthHeaders(token),
			body: JSON.stringify(subscriptionData),
		}
	);

	return handleResponse(response);
},

deleteSubscription: async (token, subscriptionId) => {
	const response = await fetch(
		`${API_BASE_URL}/subscriptions/${subscriptionId}`,
		{
			method: "DELETE",
			headers: getAuthHeaders(token),
		}
	);

	return handleResponse(response);
},

};

// =====================================================
// PAYMENT STATUS APIs
// =====================================================

export const paymentStatusAPI = {
getPaymentStatusByEmail: async (token, email) => {
const response = await fetch(
`${API_BASE_URL}/payment-status/${encodeURIComponent(email)}`,
{
method: "GET",
headers: getAuthHeaders(token),
}
);


	return handleResponse(response);
},


};

// =====================================================
// PAYMENT REQUEST APIs
// =====================================================

export const paymentRequestAPI = {
// User creates payment request
createPaymentRequest: async (token, formData) => {
const response = await fetch(`${API_BASE_URL}/payment-requests`, {
method: "POST",
headers: {
authorization: `Bearer ${token}`,
},
body: formData,
});


	return handleResponse(response);
},

// Get user's payment requests
getUserPaymentRequests: async (token) => {
	const response = await fetch(
		`${API_BASE_URL}/payment-requests/user`,
		{
			method: "GET",
			headers: getAuthHeaders(token),
		}
	);

	return handleResponse(response);
},

// Get individual user payment request
getPaymentRequest: async (token, requestId) => {
	const response = await fetch(
		`${API_BASE_URL}/payment-requests/user/${requestId}`,
		{
			method: "GET",
			headers: getAuthHeaders(token),
		}
	);

	return handleResponse(response);
},

// Admin: Get all payment requests
getAllPaymentRequests: async (token) => {
	const response = await fetch(
		`${API_BASE_URL}/payment-requests`,
		{
			method: "GET",
			headers: getAuthHeaders(token),
		}
	);

	return handleResponse(response);
},

// Admin: Approve payment request
approvePaymentRequest: async (token, requestId, data) => {
	const response = await fetch(
		`${API_BASE_URL}/payment-requests/${requestId}/approve`,
		{
			method: "PUT",
			headers: getAuthHeaders(token),
			body: JSON.stringify(data),
		}
	);

	return handleResponse(response);
},

// Admin: Reject payment request
rejectPaymentRequest: async (token, requestId, data) => {
	const response = await fetch(
		`${API_BASE_URL}/payment-requests/${requestId}/reject`,
		{
			method: "PUT",
			headers: getAuthHeaders(token),
			body: JSON.stringify(data),
		}
	);

	return handleResponse(response);
},

// Admin: Delete payment request
deletePaymentRequest: async (token, requestId) => {
	const response = await fetch(
		`${API_BASE_URL}/payment-requests/${requestId}`,
		{
			method: "DELETE",
			headers: getAuthHeaders(token),
		}
	);

	return handleResponse(response);
},

};

// =====================================================
// REPORTING APIs
// =====================================================

export const reportsAPI = {
getSummaryReport: async (token, filters = {}) => {
const params = new URLSearchParams(filters);


	const response = await fetch(
		`${API_BASE_URL}/reports/summary?${params}`,
		{
			method: "GET",
			headers: getAuthHeaders(token),
		}
	);

	return handleResponse(response);
},


};

// =====================================================
// MISCELLANEOUS APIs
// =====================================================

export const miscAPI = {
checkServerStatus: async () => {
const response = await fetch(
`${API_BASE_URL.replace("/api", "")}`,
{
method: "GET",
}
);


	return handleResponse(response);
},


};

// =====================================================
// PUBLIC REGISTRATION APIs
// =====================================================

// Keep this API for existing public registration functionality.
export const registrationAPI = {
getAll: async (token) => {
const response = await fetch(
`${API_BASE_URL}/register`,
{
method: "GET",
headers: getAuthHeaders(token),
}
);


	return handleResponse(response);
},


};

// =====================================================
// ADMIN REGISTRATION MANAGEMENT APIs
// =====================================================

// These APIs connect to:
// /api/admin/registrations
//
// Used by the existing AdminDashboard Registrations tab.

export const registrationAdminAPI = {


// ---------------------------------
// GET ALL REGISTRATIONS
// ---------------------------------

getAll: async (token, filters = {}) => {
	const params = new URLSearchParams();

	Object.entries(filters).forEach(([key, value]) => {
		if (value !== undefined && value !== null && value !== "") {
			params.append(key, String(value));
		}
	});

	const query = params.toString();

	const response = await fetch(
		`${API_BASE_URL}/admin/registrations${query ? `?${query}` : ""}`,
		{
			method: "GET",
			headers: getAuthHeaders(token),
		}
	);

	return handleResponse(response);
},

// ---------------------------------
// GET REGISTRATION DETAILS
// ---------------------------------

getById: async (token, id) => {
	const response = await fetch(
		`${API_BASE_URL}/admin/registrations/${id}`,
		{
			method: "GET",
			headers: getAuthHeaders(token),
		}
	);

	return handleResponse(response);
},

// ---------------------------------
// GET REGISTRATION HISTORY
// ---------------------------------

getHistory: async (token, id) => {
	const response = await fetch(
		`${API_BASE_URL}/admin/registrations/${id}/history`,
		{
			method: "GET",
			headers: getAuthHeaders(token),
		}
	);

	return handleResponse(response);
},

// ---------------------------------
// UPDATE REGISTRATION DETAILS
// ---------------------------------

update: async (token, id, data) => {
	const response = await fetch(
		`${API_BASE_URL}/admin/registrations/${id}`,
		{
			method: "PATCH",
			headers: getAuthHeaders(token),
			body: JSON.stringify(data),
		}
	);

	return handleResponse(response);
},

// ---------------------------------
// APPROVE / REJECT / WAITLIST / REVIEW
// ---------------------------------

updateStatus: async (token, id, data) => {
	const response = await fetch(
		`${API_BASE_URL}/admin/registrations/${id}/status`,
		{
			method: "POST",
			headers: getAuthHeaders(token),
			body: JSON.stringify(data),
		}
	);

	return handleResponse(response);
},

// ---------------------------------
// GET AVAILABLE BATCHES
// ---------------------------------

getBatches: async (token) => {
	const response = await fetch(
		`${API_BASE_URL}/admin/registrations/meta/batches`,
		{
			method: "GET",
			headers: getAuthHeaders(token),
		}
	);

	return handleResponse(response);
},

// ---------------------------------
// CREATE BATCH
// ---------------------------------

createBatch: async (token, data) => {
	const response = await fetch(
		`${API_BASE_URL}/admin/registrations/meta/batches`,
		{
			method: "POST",
			headers: getAuthHeaders(token),
			body: JSON.stringify(data),
		}
	);

	return handleResponse(response);
},

// ---------------------------------
// ASSIGN BATCH TO REGISTRATION
// ---------------------------------

assignBatch: async (token, id, batchId) => {
	const response = await fetch(
		`${API_BASE_URL}/admin/registrations/${id}/batch`,
		{
			method: "PUT",
			headers: getAuthHeaders(token),
			body: JSON.stringify({ batchId }),
		}
	);

	return handleResponse(response);
},

// ---------------------------------
// GET FEE PLANS
// ---------------------------------

getFeePlans: async (token) => {
	const response = await fetch(
		`${API_BASE_URL}/admin/registrations/meta/fee-plans`,
		{
			method: "GET",
			headers: getAuthHeaders(token),
		}
	);

	return handleResponse(response);
},

// ---------------------------------
// CREATE PAYMENT REQUEST
// ---------------------------------

createPaymentRequest: async (token, id, data) => {
	const response = await fetch(
		`${API_BASE_URL}/admin/registrations/${id}/payment-request`,
		{
			method: "POST",
			headers: getAuthHeaders(token),
			body: JSON.stringify(data),
		}
	);

	return handleResponse(response);
},

// ---------------------------------
// RECORD PAYMENT PROOF
// ---------------------------------

recordPaymentProof: async (token, id, data) => {
	const response = await fetch(
		`${API_BASE_URL}/admin/registrations/${id}/payment/proof`,
		{
			method: "POST",
			headers: getAuthHeaders(token),
			body: JSON.stringify(data),
		}
	);

	return handleResponse(response);
},

// ---------------------------------
// VERIFY PAYMENT
// ---------------------------------

verifyPayment: async (token, id, data) => {
	const response = await fetch(
		`${API_BASE_URL}/admin/registrations/${id}/payment/verify`,
		{
			method: "POST",
			headers: getAuthHeaders(token),
			body: JSON.stringify(data),
		}
	);

	return handleResponse(response);
},

// ---------------------------------
// REJECT PAYMENT
// ---------------------------------

rejectPayment: async (token, id, data) => {
	const response = await fetch(
		`${API_BASE_URL}/admin/registrations/${id}/payment/reject`,
		{
			method: "POST",
			headers: getAuthHeaders(token),
			body: JSON.stringify(data),
		}
	);

	return handleResponse(response);
},

// ---------------------------------
// CONVERT REGISTRATION TO STUDENT
// ---------------------------------

convertToStudent: async (token, id, data = {}) => {
	const response = await fetch(
		`${API_BASE_URL}/admin/registrations/${id}/convert`,
		{
			method: "POST",
			headers: getAuthHeaders(token),
			body: JSON.stringify(data),
		}
	);

	return handleResponse(response);
},

// ---------------------------------
// SEND EMAIL NOTIFICATION
// ---------------------------------

notify: async (token, id, type) => {
	const response = await fetch(
		`${API_BASE_URL}/admin/registrations/${id}/notify`,
		{
			method: "POST",
			headers: getAuthHeaders(token),
			body: JSON.stringify({ type }),
		}
	);

	return handleResponse(response);
},

// ---------------------------------
// DELETE REGISTRATION
// ---------------------------------

delete: async (token, id, reason) => {
	const response = await fetch(
		`${API_BASE_URL}/admin/registrations/${id}`,
		{
			method: "DELETE",
			headers: getAuthHeaders(token),
			body: JSON.stringify({ reason }),
		}
	);

	return handleResponse(response);

};
