const API_BASE_URL = "https://tikonecricketgurukulbackend.onrender.com/api";

// Helper function to handle API responses
const handleResponse = async (response) => {
	if (!response.ok) {
		const error = await response.json().catch(() => ({ message: "Network error" }));
		throw new Error(error.message || error.error || `HTTP error! status: ${response.status}`);
	}
	
	// Check if response has content
	const contentType = response.headers.get("content-type");
	if (contentType && contentType.includes("application/json")) {
		return response.json();
	} else {
		// For empty responses (like DELETE operations), return success
		return { success: true, message: "Operation completed successfully" };
	}
};

// Helper function to get auth headers
const getAuthHeaders = (token) => ({
	"Content-Type": "application/json",
	...(token && { authorization: `Bearer ${token}` })
});

// Authentication APIs
export const authAPI = {
	// User (Student) Authentication
	loginUser: async (credentials) => {
		const response = await fetch(`${API_BASE_URL}/user/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(credentials),
		});
		return handleResponse(response);
	},

	getUserStatus: async (token) => {
		const response = await fetch(`${API_BASE_URL}/user/status`, {
			method: "GET",
			headers: getAuthHeaders(token),
		});
		return handleResponse(response);
	},

	// Admin Authentication
	registerAdmin: async (adminData, token) => {
		const response = await fetch(`${API_BASE_URL}/admin/register`, {
			method: "POST",
			headers: getAuthHeaders(token),
			body: JSON.stringify(adminData),
		});
		return handleResponse(response);
	},

	loginAdmin: async (credentials) => {
		const response = await fetch(`${API_BASE_URL}/admin/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(credentials),
		});
		return handleResponse(response);
	},

	// Get admin status (NEW)
	getAdminStatus: async (token) => {
		const response = await fetch(`${API_BASE_URL}/admin/status`, {
			method: "GET",
			headers: getAuthHeaders(token),
		});
		return handleResponse(response);
	},
};

// Admin APIs
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
		const response = await fetch(`${API_BASE_URL}/admin/students/${studentId}`, {
			method: "PUT",
			headers: getAuthHeaders(token),
			body: JSON.stringify(studentData),
		});
		return handleResponse(response);
	},

	deleteStudent: async (token, studentId) => {
		const response = await fetch(`${API_BASE_URL}/admin/students/${studentId}`, {
			method: "DELETE",
			headers: getAuthHeaders(token),
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

// Fee Plan APIs
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
		const response = await fetch(`${API_BASE_URL}/feeplans/${feePlanId}`, {
			method: "PUT",
			headers: getAuthHeaders(token),
			body: JSON.stringify(feePlanData),
		});
		return handleResponse(response);
	},

	deleteFeePlan: async (token, feePlanId) => {
		const response = await fetch(`${API_BASE_URL}/feeplans/${feePlanId}`, {
			method: "DELETE",
			headers: getAuthHeaders(token),
		});
		return handleResponse(response);
	},
};

// Payment APIs
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
		const response = await fetch(`${API_BASE_URL}/payments/by-user/${userId}`, {
			method: "GET",
			headers: getAuthHeaders(token),
		});
		return handleResponse(response);
	},

	getPaymentsByEmail: async (token, email) => {
		const response = await fetch(`${API_BASE_URL}/payments/by-email/${email}`, {
			method: "GET",
			headers: getAuthHeaders(token),
		});
		return handleResponse(response);
	},

	updatePayment: async (token, paymentId, paymentData) => {
		const response = await fetch(`${API_BASE_URL}/payments/${paymentId}`, {
			method: "PUT",
			headers: getAuthHeaders(token),
			body: JSON.stringify(paymentData),
		});
		return handleResponse(response);
	},

	deletePayment: async (token, paymentId) => {
		const response = await fetch(`${API_BASE_URL}/payments/${paymentId}`, {
			method: "DELETE",
			headers: getAuthHeaders(token),
		});
		return handleResponse(response);
	},
};

// Subscription APIs
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
		const response = await fetch(`${API_BASE_URL}/subscriptions/${subscriptionId}`, {
			method: "GET",
			headers: getAuthHeaders(token),
		});
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
		const response = await fetch(`${API_BASE_URL}/subscriptions/${subscriptionId}`, {
			method: "PUT",
			headers: getAuthHeaders(token),
			body: JSON.stringify(subscriptionData),
		});
		return handleResponse(response);
	},

	deleteSubscription: async (token, subscriptionId) => {
		const response = await fetch(`${API_BASE_URL}/subscriptions/${subscriptionId}`, {
			method: "DELETE",
			headers: getAuthHeaders(token),
		});
		return handleResponse(response);
	},
};

// Payment Status APIs
export const paymentStatusAPI = {
	getPaymentStatusByEmail: async (token, email) => {
		const response = await fetch(`${API_BASE_URL}/payment-status/${email}`, {
			method: "GET",
			headers: getAuthHeaders(token),
		});
		return handleResponse(response);
	},
};

// Payment Request APIs
export const paymentRequestAPI = {
	createPaymentRequest: async (token, formData) => {
		const response = await fetch(`${API_BASE_URL}/payment-requests`, {
			method: "POST",
			headers: {
				authorization: `Bearer ${token}`,
			},
			body: formData, // FormData for file upload
		});
		return handleResponse(response);
	},

	getUserPaymentRequests: async (token) => {
		const response = await fetch(`${API_BASE_URL}/payment-requests/user`, {
			method: "GET",
			headers: getAuthHeaders(token),
		});
		return handleResponse(response);
	},

	getPaymentRequest: async (token, requestId) => {
		const response = await fetch(`${API_BASE_URL}/payment-requests/user/${requestId}`, {
			method: "GET",
			headers: getAuthHeaders(token),
		});
		return handleResponse(response);
	},

	// Admin APIs
	getAllPaymentRequests: async (token) => {
		const response = await fetch(`${API_BASE_URL}/payment-requests`, {
			method: "GET",
			headers: getAuthHeaders(token),
		});
		return handleResponse(response);
	},

	approvePaymentRequest: async (token, requestId, data) => {
		const response = await fetch(`${API_BASE_URL}/payment-requests/${requestId}/approve`, {
			method: "PUT",
			headers: getAuthHeaders(token),
			body: JSON.stringify(data),
		});
		return handleResponse(response);
	},

	rejectPaymentRequest: async (token, requestId, data) => {
		const response = await fetch(`${API_BASE_URL}/payment-requests/${requestId}/reject`, {
			method: "PUT",
			headers: getAuthHeaders(token),
			body: JSON.stringify(data),
		});
		return handleResponse(response);
	},

	deletePaymentRequest: async (token, requestId) => {
		const response = await fetch(`${API_BASE_URL}/payment-requests/${requestId}`, {
			method: "DELETE",
			headers: getAuthHeaders(token),
		});
		return handleResponse(response);
	},
};

// Reporting APIs
export const reportsAPI = {
	getSummaryReport: async (token, filters = {}) => {
		const params = new URLSearchParams(filters);
		const response = await fetch(`${API_BASE_URL}/reports/summary?${params}`, {
			method: "GET",
			headers: getAuthHeaders(token),
		});
		return handleResponse(response);
	},
};

// Misc APIs
export const miscAPI = {
	checkServerStatus: async () => {
		const response = await fetch(`${API_BASE_URL.replace("/api", "")}`, {
			method: "GET",
		});
		return handleResponse(response);
	},
};
