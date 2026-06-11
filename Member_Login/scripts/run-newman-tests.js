const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = path.join(__dirname, '..');

async function run() {
    console.log("🧹 Cleaning up port 3000 (if in use)...");
    try {
        execSync('npx kill-port 3000', { stdio: 'ignore' });
        console.log("✅ Port 3000 is clean.\n");
    } catch (e) {
        // ignore
    }

    console.log("🌱 Seeding database...");
    try {
        execSync('node src/seed/seed.js', { cwd: rootDir, stdio: 'inherit' });
        console.log("✅ Database seeded successfully.\n");
    } catch (err) {
        console.error("❌ Seeding failed:", err.message);
        process.exit(1);
    }

    console.log("🚀 Starting Express server...");
    const serverProcess = spawn('node', ['src/server.js'], {
        cwd: rootDir,
        env: { ...process.env, PORT: '3000' }
    });

    let serverStarted = false;
    
    serverProcess.stdout.on('data', (data) => {
        const output = data.toString();
        console.log(`[Server] ${output.trim()}`);
        if (output.toLowerCase().includes("server running on port") || output.toLowerCase().includes("mongodb connected")) {
            if (!serverStarted) {
                serverStarted = true;
                // Give it a tiny delay to ensure connection is fully established and ready
                setTimeout(() => runNewman(serverProcess), 1500);
            }
        }
    });

    serverProcess.stderr.on('data', (data) => {
        console.error(`[Server Error] ${data.toString().trim()}`);
    });

    // Timeout fallback if server fails to print start message
    setTimeout(() => {
        if (!serverStarted) {
            console.log("⏱️ Timeout waiting for server logs, starting Newman anyway...");
            serverStarted = true;
            runNewman(serverProcess);
        }
    }, 6000);
}

function runNewman(serverProcess) {
    const newman = require('newman');
    console.log("\n📡 Running Newman Postman API Test Suite...");

    newman.run({
        collection: path.join(rootDir, 'postman-collection.json'),
        reporters: ['cli', 'htmlextra'],
        reporter: {
            htmlextra: {
                export: path.join(rootDir, 'newman-report.html'),
                title: 'Society Management System - 57 APIs Test Report'
            }
        }
    }, function (err, summary) {
        console.log("\nStop hook trigger: Terminating Express server...");
        serverProcess.kill('SIGINT');

        if (err) {
            console.error("❌ Newman execution failed:", err);
            process.exit(1);
        }

        const stats = summary.run.stats;
        const failures = summary.run.failures;

        // 1. Generate Markdown report
        let reportMarkdown = `# 57 API Testing Execution Report\n\n`;
        reportMarkdown += `**Execution Time:** ${new Date().toLocaleString()}\n\n`;
        reportMarkdown += `### Summary Statistics\n\n`;
        reportMarkdown += `| Metric | Count |\n|---|---|\n`;
        reportMarkdown += `| Total Requests | ${stats.requests.total} |\n`;
        reportMarkdown += `| Total Assertions | ${stats.assertions.total} |\n`;
        reportMarkdown += `| Passed Assertions | ${stats.assertions.total - stats.assertions.failed} |\n`;
        reportMarkdown += `| Failed Assertions | ${stats.assertions.failed} |\n\n`;

        if (failures && failures.length > 0) {
            reportMarkdown += `### ❌ Failed Assertions\n\n`;
            reportMarkdown += `| Request Name | Method & URL | Error Name | Error Message |\n|---|---|---|---|\n`;
            for (const f of failures) {
                const req = f.source;
                reportMarkdown += `| ${req.name} | **${req.request.method}** ${req.request.url.toString()} | ${f.error.name} | ${f.error.message} |\n`;
            }
        } else {
            reportMarkdown += `### ✅ All 57 APIs Verified Successfully!\n\n`;
            reportMarkdown += `No failures detected during bulk execution. All assertions passed.\n`;
        }

        const reportPath = path.join(rootDir, 'api-test-report.md');
        fs.writeFileSync(reportPath, reportMarkdown, 'utf8');
        console.log(`\n📝 Markdown report generated at ${reportPath}`);
        console.log(`📊 Newman HTML report generated at ${path.join(rootDir, 'newman-report.html')}`);

        // Helper to escape HTML tags in JSON strings
        function escapeHtml(str) {
            if (typeof str !== 'string') return '';
            return str
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }

        // 2. Generate Professional Black & White HTML Report
        let bwHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Society Management System - 57 APIs Professional Health Report</title>
    <style>
        @page {
            size: A4;
            margin: 15mm;
        }
        body {
            font-family: "Segoe UI", -apple-system, sans-serif;
            color: #111;
            line-height: 1.35;
            font-size: 9.5pt;
            margin: 0;
            background-color: #fff;
        }
        h1, h2, h3, h4 {
            font-weight: bold;
            color: #000;
            margin: 0 0 10px 0;
        }
        h1 {
            font-size: 20pt;
            border-bottom: 2px solid #000;
            padding-bottom: 8px;
            margin-bottom: 15px;
        }
        h2 {
            font-size: 14pt;
            border-bottom: 1px solid #333;
            padding-bottom: 4px;
            margin-top: 25px;
            margin-bottom: 12px;
            page-break-after: avoid;
        }
        h3 {
            font-size: 11pt;
            margin-top: 15px;
            margin-bottom: 5px;
        }
        .meta-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
        }
        .meta-table td {
            padding: 6px 10px;
            border: 1px solid #ccc;
            font-size: 9pt;
        }
        .meta-table td.label {
            font-weight: bold;
            background-color: #f5f5f5;
            width: 25%;
        }
        .meta-table td.value {
            width: 25%;
        }
        .request-block {
            border: 1px solid #bbb;
            border-radius: 4px;
            padding: 12px;
            margin-bottom: 15px;
            page-break-inside: avoid;
            background-color: #fff;
        }
        .request-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1.5px solid #000;
            padding-bottom: 4px;
            margin-bottom: 8px;
        }
        .request-title {
            font-weight: bold;
            font-size: 10pt;
        }
        .method-url {
            font-family: "Consolas", "Courier New", monospace;
            font-size: 8.5pt;
            font-weight: bold;
            margin: 4px 0;
            word-break: break-all;
        }
        .method {
            background-color: #000;
            color: #fff;
            padding: 1px 4px;
            border-radius: 2px;
            margin-right: 5px;
            font-size: 8pt;
        }
        .status-badge {
            font-family: "Consolas", monospace;
            font-weight: bold;
            font-size: 9pt;
            border: 1px solid #000;
            padding: 1px 5px;
            border-radius: 3px;
        }
        .section-label {
            font-size: 8pt;
            text-transform: uppercase;
            font-weight: bold;
            color: #444;
            margin-top: 8px;
            margin-bottom: 2px;
        }
        pre {
            background-color: #fafafa;
            border: 1px solid #ddd;
            padding: 6px;
            border-radius: 3px;
            font-family: "Consolas", "Courier New", monospace;
            font-size: 8pt;
            white-space: pre-wrap;
            word-break: break-all;
            margin: 2px 0 6px 0;
        }
        .assertions {
            margin-top: 6px;
            padding-left: 15px;
        }
        .assertion-item {
            font-size: 8.5pt;
            margin-bottom: 2px;
        }
        .assertion-pass {
            color: #111;
        }
        .assertion-pass::before {
            content: "[PASS]  ";
            font-weight: bold;
        }
        .assertion-fail {
            color: #ff0000;
            font-weight: bold;
        }
        .assertion-fail::before {
            content: "[FAIL]  ";
        }
        .footer {
            font-size: 8pt;
            text-align: center;
            margin-top: 30px;
            border-top: 1px solid #ccc;
            padding-top: 5px;
            color: #555;
        }
    </style>
</head>
<body>
    <h1>API Verification & Health Report</h1>
    <h3 style="margin-top:0; color:#555;">Society Management System — 57 Core APIs</h3>
    
    <table class="meta-table">
        <tr>
            <td class="label">Date of Run</td>
            <td class="value">${new Date().toLocaleString()}</td>
            <td class="label">Test Environment</td>
            <td class="value">Local Development</td>
        </tr>
        <tr>
            <td class="label">Total Request Calls</td>
            <td class="value">${stats.requests.total}</td>
            <td class="label">Database Engine</td>
            <td class="value">MongoDB (Mongoose ODM)</td>
        </tr>
        <tr>
            <td class="label">Total Assertions</td>
            <td class="value">${stats.assertions.total}</td>
            <td class="label">Passed Assertions</td>
            <td class="value">${stats.assertions.total - stats.assertions.failed}</td>
        </tr>
        <tr>
            <td class="label">Failed Assertions</td>
            <td class="value" style="font-weight:bold; color:${stats.assertions.failed > 0 ? '#ff0000' : '#000'}">${stats.assertions.failed}</td>
            <td class="label">Status</td>
            <td class="value" style="font-weight:bold;">${stats.assertions.failed === 0 ? '100% SUCCESS' : 'FAILURES DETECTED'}</td>
        </tr>
    </table>

    <h2>Detailed Request Logs</h2>
`;

        let count = 1;
        summary.run.executions.forEach(exec => {
            const req = exec.request;
            const res = exec.response;
            const name = exec.item.name;
            const method = req.method;
            const url = req.url.toString();
            const statusCode = res ? `${res.code} ${res.status}` : 'N/A';
            
            let reqBodyStr = '';
            if (req.body) {
                if (req.body.mode === 'raw' && req.body.raw) {
                    try {
                        reqBodyStr = JSON.stringify(JSON.parse(req.body.raw), null, 2);
                    } catch(e) {
                        reqBodyStr = req.body.raw;
                    }
                } else if (req.body.mode === 'formdata' && req.body.formdata) {
                    reqBodyStr = req.body.formdata.map(p => {
                        if (p.type === 'file') return `${p.key}: [File: ${p.src || 'uploaded file'}]`;
                        return `${p.key}: ${p.value}`;
                    }).join('\n');
                }
            }

            let resBodyStr = '';
            if (res && res.stream) {
                const rawRes = res.stream.toString('utf8');
                try {
                    resBodyStr = JSON.stringify(JSON.parse(rawRes), null, 2);
                } catch(e) {
                    resBodyStr = rawRes;
                }
            }

            let assertionHtml = '';
            if (exec.assertions && exec.assertions.length > 0) {
                assertionHtml += `<div class="section-label">Test Assertions</div><div class="assertions">`;
                exec.assertions.forEach(assert => {
                    if (assert.error) {
                        assertionHtml += `<div class="assertion-item assertion-fail">${assert.assertion} (${assert.error.message})</div>`;
                    } else {
                        assertionHtml += `<div class="assertion-item assertion-pass">${assert.assertion}</div>`;
                    }
                });
                assertionHtml += `</div>`;
            }

            bwHtml += `
    <div class="request-block">
        <div class="request-header">
            <span class="request-title">${count++}. ${name}</span>
            <span class="status-badge">${statusCode}</span>
        </div>
        <div class="method-url"><span class="method">${method}</span>${url}</div>
        
        ${reqBodyStr ? `<div class="section-label">Request Payload</div><pre>${escapeHtml(reqBodyStr)}</pre>` : ''}
        ${resBodyStr ? `<div class="section-label">Response Body</div><pre>${escapeHtml(resBodyStr)}</pre>` : ''}
        ${assertionHtml}
    </div>
`;
        });

        bwHtml += `
</body>
</html>
`;

        const bwHtmlPath = path.join(rootDir, 'bw-report.html');
        fs.writeFileSync(bwHtmlPath, bwHtml, 'utf8');
        console.log(`📄 Professional B&W HTML report generated at ${bwHtmlPath}`);

        // 3. Convert HTML to PDF using Microsoft Edge headlessly
        const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
        const pdfPath = path.join(rootDir, 'api-test-report.pdf');

        try {
            console.log("Generating Professional B&W PDF report using Microsoft Edge...");
            execSync(`"${edgePath}" --headless --disable-gpu --print-to-pdf="${pdfPath}" --print-to-pdf-no-header "${bwHtmlPath}"`, { stdio: 'inherit' });
            console.log(`\n✅ PDF report successfully generated at ${pdfPath}`);
        } catch (e) {
            console.error("❌ Failed to generate PDF:", e.message);
        }

        if (stats.assertions.failed > 0) {
            console.log(`❌ Done with ${stats.assertions.failed} failed assertions.`);
            process.exit(1);
        } else {
            console.log("🎉 Done! All tests passed successfully.");
            process.exit(0);
        }
    });
}

run();
