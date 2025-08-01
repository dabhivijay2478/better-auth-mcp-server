import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./utils/auth.js";
 
const app = express();
const port = 8000;

app.all("/api/auth/*splat", toNodeHandler(auth)); 

app.use(express.json());


// Add this root route to handle successful verification redirects
app.get("/", (req, res) => {
    res.json({ 
        message: "Email verification successful! You can now sign in.",
        success: true 
    });
});

app.get("/test", (req, res) => {
    res.json({ message: "Server is working!" });
});


// Add this debug route to see available auth endpoints
app.get("/debug/auth-endpoints", (req, res) => {
    // Get all the available endpoints from Better Auth
    const endpoints = Object.keys(auth.api);
    res.json({ 
        availableEndpoints: endpoints,
        message: "These are all available Better Auth API endpoints"
    });
});



// Add this route to test accountInfo server-side
app.get("/debug/test-account-info", async (req, res) => {
    try {
        const accountInfo = await auth.api.accountInfo({
            headers: req.headers
        });
        res.json({ 
            success: true,
            accountInfo: accountInfo
        });
    } catch (error) {
        res.status(error.status || 500).json({ 
            success: false,
            error: error.message,
            code: error.code 
        });
    }
});

// Test all available endpoints that might give account info
app.get("/debug/test-all-account-endpoints", async (req, res) => {
    const results = {};
    
    const endpointsToTest = [
        'accountInfo',
        'getSession', 
        'listUserAccounts',
        'listSessions'
    ];
    
    for (const endpoint of endpointsToTest) {
        try {
            if (auth.api[endpoint]) {
                const result = await auth.api[endpoint]({
                    headers: req.headers
                });
                results[endpoint] = { success: true, data: result };
            } else {
                results[endpoint] = { success: false, error: 'Endpoint not found' };
            }
        } catch (error) {
            results[endpoint] = { 
                success: false, 
                error: error.message,
                code: error.code 
            };
        }
    }
    
    res.json(results);
});


app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});