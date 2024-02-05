const fs = require('fs');
const marked = require('marked');
const axios = require('axios');

const quizUrls = [
    'https://raw.githubusercontent.com/kananinirav/AWS-Certified-Cloud-Practitioner-Notes/master/practice-exam/practice-exam-1.md',
    'https://raw.githubusercontent.com/kananinirav/AWS-Certified-Cloud-Practitioner-Notes/master/practice-exam/practice-exam-2.md',
    'https://raw.githubusercontent.com/kananinirav/AWS-Certified-Cloud-Practitioner-Notes/master/practice-exam/practice-exam-3.md',
    'https://raw.githubusercontent.com/kananinirav/AWS-Certified-Cloud-Practitioner-Notes/master/practice-exam/practice-exam-4.md',
    'https://raw.githubusercontent.com/kananinirav/AWS-Certified-Cloud-Practitioner-Notes/master/practice-exam/practice-exam-5.md',
    'https://raw.githubusercontent.com/kananinirav/AWS-Certified-Cloud-Practitioner-Notes/master/practice-exam/practice-exam-6.md',
    'https://raw.githubusercontent.com/kananinirav/AWS-Certified-Cloud-Practitioner-Notes/master/practice-exam/practice-exam-7.md',
    'https://raw.githubusercontent.com/kananinirav/AWS-Certified-Cloud-Practitioner-Notes/master/practice-exam/practice-exam-8.md',
    'https://raw.githubusercontent.com/kananinirav/AWS-Certified-Cloud-Practitioner-Notes/master/practice-exam/practice-exam-9.md',
    'https://raw.githubusercontent.com/kananinirav/AWS-Certified-Cloud-Practitioner-Notes/master/practice-exam/practice-exam-10.md',
    'https://raw.githubusercontent.com/kananinirav/AWS-Certified-Cloud-Practitioner-Notes/master/practice-exam/practice-exam-11.md',
    'https://raw.githubusercontent.com/kananinirav/AWS-Certified-Cloud-Practitioner-Notes/master/practice-exam/practice-exam-12.md',
    'https://raw.githubusercontent.com/kananinirav/AWS-Certified-Cloud-Practitioner-Notes/master/practice-exam/practice-exam-13.md',
    'https://raw.githubusercontent.com/kananinirav/AWS-Certified-Cloud-Practitioner-Notes/master/practice-exam/practice-exam-14.md',
    'https://raw.githubusercontent.com/kananinirav/AWS-Certified-Cloud-Practitioner-Notes/master/practice-exam/practice-exam-15.md',
    'https://raw.githubusercontent.com/kananinirav/AWS-Certified-Cloud-Practitioner-Notes/master/practice-exam/practice-exam-16.md',
    'https://raw.githubusercontent.com/kananinirav/AWS-Certified-Cloud-Practitioner-Notes/master/practice-exam/practice-exam-17.md',
    'https://raw.githubusercontent.com/kananinirav/AWS-Certified-Cloud-Practitioner-Notes/master/practice-exam/practice-exam-18.md',
    'https://raw.githubusercontent.com/kananinirav/AWS-Certified-Cloud-Practitioner-Notes/master/practice-exam/practice-exam-19.md',
    'https://raw.githubusercontent.com/kananinirav/AWS-Certified-Cloud-Practitioner-Notes/master/practice-exam/practice-exam-20.md',
    'https://raw.githubusercontent.com/kananinirav/AWS-Certified-Cloud-Practitioner-Notes/master/practice-exam/practice-exam-21.md',
    'https://raw.githubusercontent.com/kananinirav/AWS-Certified-Cloud-Practitioner-Notes/master/practice-exam/practice-exam-22.md',
    'https://raw.githubusercontent.com/kananinirav/AWS-Certified-Cloud-Practitioner-Notes/master/practice-exam/practice-exam-23.md'
];

async function downloadQuizContent(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error downloading content from ${url}: ${error.message}`);
        return null;
    }
}
let questionNumber = 1;

function processQuizContent(markdownContent) {
    let tokens = marked.lexer(markdownContent);

    const questions = [];

    let currentQuestion = null;
    tokens = tokens.filter(token => token.type === 'list');
    tokens[0].items.forEach(token => {
        if (token.type === 'list_item') {
            let currentQuestion = {
                questionNumber: questionNumber++,
                question: token.tokens[0].text.trim(),
                options: token.tokens.find(token => token.type === 'list').items.map(item => item.text),
                correctAnswer: token.tokens.find(token => token.raw.match(/Correct [A|a]nswer: (.+)/)).text
            };
            const match = currentQuestion.correctAnswer.match(/Correct [A|a]nswer: (.+)/);
            if (match && match[1]) {
                const answerArray = match[1].split('').filter(char => char.match(/[A-Z]/));
                currentQuestion.correctAnswer = answerArray;
            }
            questions.push(currentQuestion);
        }
    });

    return questions;
}

// Function to write JSON content to a file
function writeJsonToFile(jsonContent) {
    fs.writeFileSync('quiz.json', jsonContent, 'utf8');
    console.log('JSON file generated successfully!');
}

// Main function to iterate through URLs and generate quiz JSON
async function generateQuizJson() {
    const allQuestions = [];

    for (const url of quizUrls) {
        const quizContent = await downloadQuizContent(url);
        if (quizContent) {
            const questions = processQuizContent(quizContent);
            allQuestions.push(...questions);
        }
    }

    const jsonContent = JSON.stringify(allQuestions, null, 2);
    writeJsonToFile(jsonContent);
}

generateQuizJson();
