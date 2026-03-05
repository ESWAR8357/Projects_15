// CLIENT LOGIC - Handles user interaction and builds JSON request payload
function sendRequest() {
    const userName = document.getElementById('userName').value;
    
    // Build JSON request payload with user input and timestamp
    const requestPayload = {
        userName: userName,
        requestId: generateRequestId(),
        timestamp: new Date().toISOString(),
        clientInfo: {
            userAgent: navigator.userAgent.split(' ')[0],
            language: navigator.language
        }
    };
    
    // Send request to simulated server function
    const response = simulatedServer(requestPayload);
    
    // Display formatted response in UI
    displayResponse(response);
}

// SERVER SIMULATION - Processes client requests and returns structured JSON responses
function simulatedServer(request) {
    // REQUEST VALIDATION - Check for empty or invalid input
    if (!request.userName || request.userName.trim() === '') {
        return {
            statusCode: 400,
            status: "Bad Request",
            message: "User name is required and cannot be empty",
            timestamp: new Date().toISOString(),
            requestId: request.requestId,
            data: null,
            error: {
                code: "VALIDATION_ERROR",
                details: "The userName field must contain at least one character"
            }
        };
    }
    
    // Process valid request and generate successful response
    const processedName = request.userName.trim();
    return {
        statusCode: 200,
        status: "OK",
        message: `Hello, ${processedName}! Your request has been processed successfully.`,
        timestamp: new Date().toISOString(),
        requestId: request.requestId,
        data: {
            userId: Math.floor(Math.random() * 10000) + 1000,
            userName: processedName,
            welcomeMessage: `Welcome to the system, ${processedName}!`,
            sessionId: generateSessionId(),
            requestReceived: request.timestamp,
            processingTime: Math.floor(Math.random() * 50) + 10 + "ms"
        }
    };
}

// RESPONSE HANDLING - Renders server response with visual feedback
function displayResponse(response) {
    const responseElement = document.getElementById('response');
    
    // Format response as indented JSON for readability
    const formattedResponse = JSON.stringify(response, null, 2);
    
    // Display formatted JSON response
    responseElement.textContent = formattedResponse;
    
    // Apply visual styling based on response status
    responseElement.className = 'response-container';
    if (response.statusCode >= 400) {
        responseElement.classList.add('error');
    } else {
        responseElement.classList.add('success');
    }
    
    // Smooth scroll to response section
    responseElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// UTILITY FUNCTIONS - Generate unique identifiers for requests and sessions
function generateRequestId() {
    return 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
}

function generateSessionId() {
    return 'sess_' + Math.random().toString(36).substr(2, 10);
}

// ERROR HANDLING - Graceful error management built into validation and response logic
// The simulator handles all errors by returning appropriate HTTP status codes and descriptive messages