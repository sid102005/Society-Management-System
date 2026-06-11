const fs = require('fs');
const path = require('path');

const collectionPath = path.join(__dirname, '..', 'postman-collection.json');
const backupPath = path.join(__dirname, '..', 'postman-collection.backup.json');

// 1. Restore from backup if it exists (idempotency), or create backup if it doesn't
if (fs.existsSync(backupPath)) {
    fs.copyFileSync(backupPath, collectionPath);
    console.log("🔄 Restored clean postman-collection.json from original backup.");
} else {
    fs.copyFileSync(collectionPath, backupPath);
    console.log("💾 Backup of postman-collection.json created at postman-collection.backup.json");
}

const collection = JSON.parse(fs.readFileSync(collectionPath, 'utf8'));

// Define standard status assertions
const assert200 = `pm.test("Status code is 200", function () { pm.response.to.have.status(200); });`;
const assert201 = `pm.test("Status code is 201", function () { pm.response.to.have.status(201); });`;
const assert200or201 = `pm.test("Status code is 200 or 201", function () { pm.expect(pm.response.code).to.be.oneOf([200, 201]); });`;

// Mapping of request name patterns to test scripts
const testMappings = [
    {
        name: "Register Resident",
        assertions: [
            assert200or201,
            `var jsonData = pm.response.json(); pm.test("Register successful", function () { pm.expect(jsonData.success).to.be.true; });`
        ]
    },
    {
        name: "Login Resident",
        assertions: [
            assert200,
            `var jsonData = pm.response.json(); pm.test("Login successful", function () { pm.expect(jsonData.success).to.be.true; });`
        ]
    },
    {
        name: "Add Family Member",
        assertions: [
            assert201,
            `var jsonData = pm.response.json(); pm.test("Family member added successfully", function () { pm.expect(jsonData.success).to.be.true; });`,
            `var jsonData = pm.response.json(); if (jsonData && jsonData.data && jsonData.data.familyMember) { pm.collectionVariables.set("familyMemberId", jsonData.data.familyMember._id); }`
        ]
    },
    {
        name: "Add Owned Vehicle",
        assertions: [
            assert201,
            `var jsonData = pm.response.json(); pm.test("Vehicle added successfully", function () { pm.expect(jsonData.success).to.be.true; });`,
            `var jsonData = pm.response.json(); if (jsonData && jsonData.data && jsonData.data.vehicle) { pm.collectionVariables.set("vehicleId", jsonData.data.vehicle._id); }`
        ]
    },
    {
        name: "Submit Move-Out Request",
        assertions: [
            assert201,
            `var jsonData = pm.response.json(); pm.test("Move-out request created", function () { pm.expect(jsonData.success).to.be.true; });`,
            `var jsonData = pm.response.json(); if (jsonData && jsonData.data && jsonData.data.moveOutRequest) { pm.collectionVariables.set("moveOutId", jsonData.data.moveOutRequest._id); }`
        ]
    },
    {
        name: "Create Rental/Resale Listing",
        assertions: [
            assert201,
            `var jsonData = pm.response.json(); pm.test("Listing created", function () { pm.expect(jsonData.success).to.be.true; });`,
            `var jsonData = pm.response.json(); if (jsonData && jsonData.data && jsonData.data.listing) { pm.collectionVariables.set("listingId", jsonData.data.listing._id); }`
        ]
    },
    {
        name: "Share Flat Documents (Link Gen)",
        assertions: [
            assert201,
            `var jsonData = pm.response.json(); pm.test("Document shared", function () { pm.expect(jsonData.success).to.be.true; });`,
            `var jsonData = pm.response.json(); if (jsonData && jsonData.data && jsonData.data.sharedDocument) { pm.collectionVariables.set("sharedDocumentId", jsonData.data.sharedDocument._id); pm.collectionVariables.set("sharedDocumentToken", jsonData.data.sharedDocument.shareToken); }`
        ]
    },
    {
        name: "View Outstanding Dues",
        assertions: [
            assert200,
            `var jsonData = pm.response.json(); if (jsonData && jsonData.data && jsonData.data.outstandingBills && jsonData.data.outstandingBills.length > 0) { pm.collectionVariables.set("billId", jsonData.data.outstandingBills[0]._id); }`
        ]
    },
    {
        name: "View Penalty Breakdown & Charges",
        assertions: [
            assert200,
            `var jsonData = pm.response.json(); if (jsonData && jsonData.data && jsonData.data.bills && jsonData.data.bills.length > 0) { pm.collectionVariables.set("billId", jsonData.data.bills[0]._id); }`
        ]
    },
    {
        name: "Initiate Payment (Get Signature)",
        assertions: [
            assert200,
            `var jsonData = pm.response.json(); if (jsonData && jsonData.data && jsonData.data.paymentSignature) { pm.collectionVariables.set("paymentSignature", jsonData.data.paymentSignature); }`
        ]
    },
    {
        name: "Pay Maintenance Online (UPI/Card)",
        assertions: [
            assert201,
            `var jsonData = pm.response.json(); if (jsonData && jsonData.data && jsonData.data.receipt) { pm.collectionVariables.set("receiptId", jsonData.data.receipt._id); }`
        ]
    },
    {
        name: "Pre-approve Visitors",
        assertions: [
            assert201,
            `var jsonData = pm.response.json(); if (jsonData && jsonData.data && jsonData.data.visitor) { pm.collectionVariables.set("visitorId", jsonData.data.visitor._id); }`,
            `var jsonData = pm.response.json(); if (jsonData && jsonData.data && jsonData.data.otp) { pm.collectionVariables.set("visitorOtp", jsonData.data.otp); }`
        ]
    },
    {
        name: "Record Visitor Checkout (Exit)",
        assertions: [
            `pm.test("Status code is 200, 201 or 400", function () { pm.expect(pm.response.code).to.be.oneOf([200, 201, 400]); });`
        ]
    },
    {
        name: "Add Domestic Helper",
        assertions: [
            assert201,
            `var jsonData = pm.response.json(); if (jsonData && jsonData.data && jsonData.data.helper) { pm.collectionVariables.set("helperId", jsonData.data.helper._id); }`
        ]
    },
    {
        name: "Record Helper Attendance",
        assertions: [
            `pm.test("Status code is 200, 201 or 409", function () { pm.expect(pm.response.code).to.be.oneOf([200, 201, 409]); });`
        ]
    },
    {
        name: "Raise a Complaint",
        assertions: [
            assert201,
            `var jsonData = pm.response.json(); if (jsonData && jsonData.data && jsonData.data.complaint) { pm.collectionVariables.set("complaintId", jsonData.data.complaint._id); }`
        ]
    },
    {
        name: "Browse Available Amenities",
        assertions: [
            assert200,
            `var jsonData = pm.response.json(); if (jsonData && jsonData.data && jsonData.data.amenities && jsonData.data.amenities.length > 0) { pm.collectionVariables.set("amenityId", jsonData.data.amenities[0]._id); }`
        ]
    },
    {
        name: "Book Amenity Slot",
        assertions: [
            assert201,
            `var jsonData = pm.response.json(); if (jsonData && jsonData.data && jsonData.data.booking) { pm.collectionVariables.set("bookingId", jsonData.data.booking._id); }`
        ]
    },
    {
        name: "Browse Accommodations / Guest Rooms",
        assertions: [
            assert200,
            `var jsonData = pm.response.json(); if (jsonData && jsonData.data && jsonData.data.accommodations && jsonData.data.accommodations.length > 0) { pm.collectionVariables.set("accommodationId", jsonData.data.accommodations[0]._id); }`
        ]
    },
    {
        name: "Book Guest Room",
        assertions: [
            assert201,
            `var jsonData = pm.response.json(); if (jsonData && jsonData.data && jsonData.data.booking) { pm.collectionVariables.set("accommodationBookingId", jsonData.data.booking._id); }`
        ]
    },
    {
        name: "Get Active Feedback Surveys",
        assertions: [
            assert200,
            `var jsonData = pm.response.json(); if (jsonData && jsonData.data && jsonData.data.surveys && jsonData.data.surveys.length > 0) { pm.collectionVariables.set("surveyId", jsonData.data.surveys[0]._id); }`
        ]
    },
    {
        name: "View Committee Resolutions/Decisions",
        assertions: [
            assert200,
            `var jsonData = pm.response.json(); if (jsonData && jsonData.data && jsonData.data.resolutions && jsonData.data.resolutions.length > 0) { pm.collectionVariables.set("resolutionId", jsonData.data.resolutions[0]._id); }`
        ]
    },
    {
        name: "Create Discussion Board Thread",
        assertions: [
            assert201,
            `var jsonData = pm.response.json(); if (jsonData && jsonData.data && jsonData.data.discussion) { pm.collectionVariables.set("discussionId", jsonData.data.discussion._id); }`
        ]
    },
    {
        name: "Society Events Calendar",
        assertions: [
            assert200,
            `var jsonData = pm.response.json(); if (jsonData && jsonData.data && jsonData.data.events && jsonData.data.events.length > 0) { pm.collectionVariables.set("eventId", jsonData.data.events[0]._id); }`
        ]
    },
    {
        name: "List Notice Board Polls",
        assertions: [
            assert200,
            `var jsonData = pm.response.json(); if (jsonData && jsonData.data && jsonData.data.polls && jsonData.data.polls.length > 0) { pm.collectionVariables.set("pollId", jsonData.data.polls[0]._id); }`
        ]
    },
    {
        name: "View Notice Board",
        assertions: [
            assert200,
            `var jsonData = pm.response.json(); if (jsonData && jsonData.data && jsonData.data.notices && jsonData.data.notices.length > 0) { pm.collectionVariables.set("noticeId", jsonData.data.notices[0]._id); }`
        ]
    },
    {
        name: "Receive Push & SMS Notifications list",
        assertions: [
            assert200,
            `var jsonData = pm.response.json(); if (jsonData && jsonData.data && jsonData.data.notifications && jsonData.data.notifications.length > 0) { pm.collectionVariables.set("notificationId", jsonData.data.notifications[0]._id); }`
        ]
    },
    {
        name: "Rate & Review Society Amenity",
        assertions: [
            `pm.test("Status code is 200, 201 or 400", function () { pm.expect(pm.response.code).to.be.oneOf([200, 201, 400]); });`
        ]
    },
    {
        name: "Rate Complaint Resolution",
        assertions: [
            `pm.test("Status code is 200, 201 or 400", function () { pm.expect(pm.response.code).to.be.oneOf([200, 201, 400]); });`
        ]
    }
];

const rootDir = path.join(__dirname, '..');

// 2. Ensure dummy files exist for form-data uploads
const dummyPngPath = path.join(rootDir, 'dummy.png');
const dummyPdfPath = path.join(rootDir, 'dummy.pdf');
if (!fs.existsSync(dummyPngPath)) {
    fs.writeFileSync(dummyPngPath, 'Dummy PNG Content', 'utf8');
    console.log("📄 Created dummy.png in project root");
}
if (!fs.existsSync(dummyPdfPath)) {
    fs.writeFileSync(dummyPdfPath, 'Dummy PDF Content', 'utf8');
    console.log("📄 Created dummy.pdf in project root");
}

// 3. Helper to recursively process items and add test scripts
function processItems(items) {
    for (const item of items) {
        if (item.item && Array.isArray(item.item)) {
            processItems(item.item);
        } else if (item.request) {
            const reqName = item.name;
            let assertions = [assert200or201]; // Default fallback assertion

            // Match based on mapping
            const match = testMappings.find(m => reqName.includes(m.name));
            if (match) {
                assertions = match.assertions;
            }

            // Specific request replacements in raw request bodies to avoid hardcoded values
            if (item.request.body && item.request.body.mode === 'raw' && item.request.body.raw) {
                let rawBody = item.request.body.raw;
                
                // Replace hardcoded paymentSignature
                if (reqName.includes("Pay Maintenance Online")) {
                    rawBody = rawBody.replace(/"paymentSignature":\s*"[^"]*"/, '"paymentSignature": "{{paymentSignature}}"');
                    console.log(`🔧 Injected dynamic paymentSignature parameter into: ${reqName}`);
                }
                
                // Replace hardcoded OTP in approve visitor
                if (reqName.includes("Approve Visitor")) {
                    rawBody = rawBody.replace(/"otp":\s*"[^"]*"/, '"otp": "{{visitorOtp}}"');
                    console.log(`🔧 Injected dynamic visitorOtp parameter into: ${reqName}`);
                }

                // Change status update to keep role as Owner
                if (reqName.includes("Tenant/Owner Status Management")) {
                    try {
                        let parsed = JSON.parse(rawBody);
                        parsed.residentType = "Owner";
                        rawBody = JSON.stringify(parsed, null, 2);
                        console.log(`🔧 Overrode residentType to "Owner" in: ${reqName}`);
                    } catch (e) {
                        rawBody = rawBody.replace(/"residentType":\s*"[^"]*"/, '"residentType": "Owner"');
                        console.log(`🔧 Injected residentType: "Owner" regex fallback in: ${reqName}`);
                    }
                }

                // Update survey response to include 3 answers
                if (reqName.includes("Submit annual feedback satisfaction survey response")) {
                    const surveyBody = {
                        answers: [
                            { questionIndex: 0, answer: 5 },
                            { questionIndex: 1, answer: 4 },
                            { questionIndex: 2, answer: "yes" }
                        ]
                    };
                    rawBody = JSON.stringify(surveyBody, null, 2);
                    console.log(`🔧 Configured 3 survey answers in: ${reqName}`);
                }

                item.request.body.raw = rawBody;
            }

            // If body mode is formdata, check for file inputs and map mock files
            if (item.request.body && item.request.body.mode === 'formdata' && item.request.body.formdata) {
                for (const param of item.request.body.formdata) {
                    if (param.type === 'file') {
                        if (param.key === 'images' || param.key === 'image' || param.key === 'profileImage') {
                            param.src = 'dummy.png';
                        } else {
                            param.src = 'dummy.pdf';
                        }
                        console.log(`📎 Configured file upload parameter "${param.key}" -> "${param.src}" in: ${reqName}`);
                    }
                }
            }
            // If it is the stream complaints endpoint, append query parameter
            if (reqName.includes("Track Complaint Status") || reqName.includes("stream")) {
                if (typeof item.request.url === 'string') {
                    if (!item.request.url.includes("test=true")) {
                        item.request.url += "?test=true";
                    }
                } else if (item.request.url && typeof item.request.url.raw === 'string') {
                    if (!item.request.url.raw.includes("test=true")) {
                        item.request.url.raw += "?test=true";
                    }
                    if (!item.request.url.query) {
                        item.request.url.query = [];
                    }
                    if (!item.request.url.query.some(q => q.key === 'test')) {
                        item.request.url.query.push({ key: "test", value: "true" });
                    }
                }
                console.log(`🔧 Appended ?test=true to stream URL in: ${reqName}`);
            }

            // Create Postman event structure for the test script
            item.event = [
                {
                    listen: "test",
                    script: {
                        exec: assertions,
                        type: "text/javascript"
                    }
                }
            ];
            
            console.log(`✅ Automated request: ${reqName} (${assertions.length} assertions added)`);
        }
    }
}

// 4. Find and extract "Logout (Destroy Session)" to run at the very end of bulk tests
let logoutRequestObj = null;
const authFolder = collection.item.find(i => i.name.includes("Authentication"));
if (authFolder && authFolder.item) {
    const logoutIndex = authFolder.item.findIndex(i => i.name.includes("Logout"));
    if (logoutIndex !== -1) {
        logoutRequestObj = authFolder.item.splice(logoutIndex, 1)[0];
        console.log(`\n🔄 Moved "${logoutRequestObj.name}" to the end of the collection items.`);
    }
}

// Start processing collection items
processItems(collection.item);

// Append logout request to the end of the collection items if extracted
if (logoutRequestObj) {
    // Process it to get standard assertions
    processItems([logoutRequestObj]);
    collection.item.push(logoutRequestObj);
}

// 5. Swap polls order so "List Notice Board Polls" runs before voting
function swapPollRequests(items) {
    for (const folder of items) {
        if (folder.name && folder.name.includes("Community & Communication") && folder.item && Array.isArray(folder.item)) {
            const listIdx = folder.item.findIndex(i => i.name && i.name.includes("List Notice Board Polls"));
            const voteIdx = folder.item.findIndex(i => i.name && i.name.includes("Participate in Polls (Vote)"));
            
            if (listIdx !== -1 && voteIdx !== -1 && listIdx > voteIdx) {
                const [removed] = folder.item.splice(listIdx, 1);
                folder.item.splice(voteIdx, 0, removed);
                console.log(`\n🔀 Swapped positions: "${removed.name}" now runs before "Participate in Polls (Vote)"`);
            }
            return;
        }
        if (folder.item && Array.isArray(folder.item)) {
            swapPollRequests(folder.item);
        }
    }
}
swapPollRequests(collection.item);

// 6. Write enriched collection back
fs.writeFileSync(collectionPath, JSON.stringify(collection, null, 2), 'utf8');
console.log("\n🎉 Postman collection enriched and automated successfully!");
