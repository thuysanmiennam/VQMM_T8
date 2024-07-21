const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const { invoice, store } = JSON.parse(event.body);
    const token = process.env.GITHUB_TOKEN; // Token GitHub được lưu trong biến môi trường Netlify
    const repo = 'YOUR_GITHUB_USERNAME/YOUR_REPO';
    const path = 'path/to/your/file.txt';
    const message = 'Add new data';
    const content = `${invoice}, ${store}\n`;
    const encodedContent = Buffer.from(content).toString('base64');

    const url = `https://api.github.com/repos/${repo}/contents/${path}`;
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: message,
            content: encodedContent,
            sha: await getFileSha(url, token)
        })
    });

    if (response.ok) {
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Data saved successfully' })
        };
    } else {
        return {
            statusCode: response.status,
            body: JSON.stringify({ message: 'Failed to save data' })
        };
    }
};

async function getFileSha(url, token) {
    const response = await fetch(url, {
        headers: {
            'Authorization': `token ${token}`
        }
    });
    const data = await response.json();
    return data.sha || null;
}
