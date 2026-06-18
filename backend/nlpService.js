// nlpService.js
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const TfIdf = natural.TfIdf;
const tfidf = new TfIdf();

class NLPService {
    constructor() {
        this.competencesDatabase = [
            // Programming Languages
            'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'rust',
            'php', 'swift', 'kotlin', 'scala', 'r', 'matlab', 'dart', 'perl',
            
            // Web Technologies
            'html', 'css', 'react', 'angular', 'vue.js', 'node.js', 'express.js',
            'django', 'flask', 'spring boot', 'asp.net', 'laravel', 'jquery',
            'bootstrap', 'tailwind css', 'sass', 'less', 'webpack', 'babel',
            
            // Databases
            'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch',
            'firebase', 'oracle', 'sqlite', 'mariadb', 'cassandra', 'dynamodb',
            
            // Cloud & DevOps
            'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'terraform',
            'ansible', 'ci/cd', 'gitlab ci', 'github actions', 'nginx', 'apache',
            
            // Data Science & ML
            'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'scikit-learn',
            'pandas', 'numpy', 'data analysis', 'data visualization', 'tableau',
            'power bi', 'nlp', 'computer vision', 'ai', 'artificial intelligence',
            
            // Mobile Development
            'android', 'ios', 'react native', 'flutter', 'xamarin', 'ionic',
            
            // Soft Skills
            'teamwork', 'leadership', 'communication', 'problem solving',
            'critical thinking', 'time management', 'agile', 'scrum',
            'project management', 'mentoring', 'negotiation', 'presentation',
            
            // Languages
            'english', 'french', 'arabic', 'spanish', 'german', 'italian',
            'portuguese', 'chinese', 'japanese', 'korean',
            
            // Tools & Others
            'git', 'github', 'gitlab', 'bitbucket', 'jira', 'confluence',
            'slack', 'trello', 'figma', 'adobe xd', 'photoshop', 'illustrator',
            'linux', 'unix', 'windows', 'macos', 'rest api', 'graphql',
            'microservices', 'agile methodology', 'devops'
        ];
    }

    // Extract skills from text
    extractSkills(text) {
        if (!text) return [];
        
        const textLower = text.toLowerCase();
        const words = tokenizer.tokenize(textLower);
        const foundSkills = new Set();
        
        // Check for multi-word skills first
        for (const skill of this.competencesDatabase) {
            if (textLower.includes(skill)) {
                foundSkills.add(skill);
            }
        }
        
        return Array.from(foundSkills);
    }

    // Extract contact information
    extractContactInfo(text) {
        const info = {
            email: null,
            phone: null,
            linkedin: null,
            github: null
        };
        
        // Extract email
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const emails = text.match(emailRegex);
        if (emails) info.email = emails[0];
        
        // Extract phone (Moroccan numbers)
        const phoneRegex = /(?:(?:\+|00)212|0)\s*[5-7](?:[\s.-]*\d{2}){4}/g;
        const phones = text.match(phoneRegex);
        if (phones) info.phone = phones[0];
        
        // Extract LinkedIn
        const linkedinRegex = /linkedin\.com\/in\/[a-zA-Z0-9-]+/g;
        const linkedin = text.match(linkedinRegex);
        if (linkedin) info.linkedin = linkedin[0];
        
        // Extract GitHub
        const githubRegex = /github\.com\/[a-zA-Z0-9-]+/g;
        const github = text.match(githubRegex);
        if (github) info.github = github[0];
        
        return info;
    }

    // Extract education information
    extractEducation(text) {
        const education = [];
        const educationKeywords = [
            'bachelor', 'master', 'phd', 'doctorate', 'baccalaureate',
            'engineering', 'licence', 'diploma', 'degree', 'bts', 'dut',
            'bac', 'bac+2', 'bac+3', 'bac+5', 'bac+8', 'mba',
            'bachelor of science', 'master of science', 'computer science',
            'software engineering', 'data science', 'artificial intelligence'
        ];
        
        const textLower = text.toLowerCase();
        const lines = text.split('\n');
        
        for (const line of lines) {
            for (const keyword of educationKeywords) {
                if (line.toLowerCase().includes(keyword)) {
                    education.push(line.trim());
                    break;
                }
            }
        }
        
        return education;
    }

    // Extract experience years
    extractExperienceYears(text) {
        const textLower = text.toLowerCase();
        const patterns = [
            /(\d+)\s*(?:\+\s*)?years?(?:\s+of)?\s+experience/i,
            /experience\s*:?\s*(\d+)\s*years?/i,
            /(\d+)\s*ans?\s*d['']exp[eé]rience/i,
            /exp[eé]rience\s*:?\s*(\d+)\s*ans?/i
        ];
        
        for (const pattern of patterns) {
            const match = textLower.match(pattern);
            if (match) {
                return parseInt(match[1]);
            }
        }
        
        return null;
    }

    // Extract languages with proficiency
    extractLanguages(text) {
        const languages = new Map();
        const langKeywords = [
            { name: 'arabe', keywords: ['arabe', 'arabic'] },
            { name: 'français', keywords: ['français', 'francais', 'french'] },
            { name: 'anglais', keywords: ['anglais', 'english'] },
            { name: 'espagnol', keywords: ['espagnol', 'spanish'] },
            { name: 'allemand', keywords: ['allemand', 'german'] },
            { name: 'italien', keywords: ['italien', 'italian'] }
        ];
        
        const textLower = text.toLowerCase();
        
        for (const lang of langKeywords) {
            for (const keyword of lang.keywords) {
                if (textLower.includes(keyword)) {
                    const proficiency = this.extractProficiency(textLower, keyword);
                    languages.set(lang.name, proficiency);
                    break;
                }
            }
        }
        
        return Object.fromEntries(languages);
    }

    // Helper to extract proficiency
    extractProficiency(text, keyword) {
        const proficiencyMap = {
            'native': 'natif',
            'fluent': 'courant',
            'bilingual': 'bilingue',
            'intermediate': 'intermédiaire',
            'beginner': 'débutant',
            'advanced': 'avancé',
            'maternelle': 'natif',
            'courant': 'courant',
            'bilingue': 'bilingue',
            'intermédiaire': 'intermédiaire',
            'débutant': 'débutant',
            'avancé': 'avancé'
        };
        
        // Look for proficiency near the language keyword
        const index = text.indexOf(keyword);
        const nearby = text.substring(Math.max(0, index - 50), index + 50 + keyword.length);
        
        for (const [key, value] of Object.entries(proficiencyMap)) {
            if (nearby.includes(key)) return value;
        }
        
        return 'non spécifié';
    }

    // Calculate CV strength score
    calculateCVScore(text) {
        let score = 0;
        const maxScore = 100;
        
        // Check for essential sections
        if (text.toLowerCase().includes('education') || text.toLowerCase().includes('formation')) {
            score += 10;
        }
        if (text.toLowerCase().includes('experience') || text.toLowerCase().includes('expérience')) {
            score += 10;
        }
        if (text.toLowerCase().includes('skill') || text.toLowerCase().includes('compétence')) {
            score += 10;
        }
        
        // Check for contact information
        if (this.extractContactInfo(text).email) score += 10;
        if (this.extractContactInfo(text).phone) score += 10;
        
        // Check for skills
        const skills = this.extractSkills(text);
        score += Math.min(skills.length * 2, 20);
        
        // Check for languages
        const languages = this.extractLanguages(text);
        score += Math.min(Object.keys(languages).length * 5, 15);
        
        // Check for education
        const education = this.extractEducation(text);
        score += Math.min(education.length * 3, 15);
        
        return Math.min(score, maxScore);
    }

    // Generate CV improvement suggestions
    generateSuggestions(text) {
        const suggestions = [];
        const textLower = text.toLowerCase();
        
        if (!textLower.includes('email')) {
            suggestions.push('Ajoutez votre adresse email');
        }
        if (!textLower.includes('phone') && !textLower.includes('téléphone') && !textLower.includes('tel')) {
            suggestions.push('Ajoutez votre numéro de téléphone');
        }
        if (!textLower.includes('linkedin')) {
            suggestions.push('Ajoutez votre profil LinkedIn');
        }
        if (!textLower.includes('education') && !textLower.includes('formation')) {
            suggestions.push('Ajoutez une section Formation/Éducation');
        }
        if (!textLower.includes('experience') && !textLower.includes('expérience')) {
            suggestions.push('Ajoutez une section Expérience professionnelle');
        }
        if (!textLower.includes('skill') && !textLower.includes('compétence')) {
            suggestions.push('Ajoutez une section Compétences');
        }
        if (text.length < 500) {
            suggestions.push('Votre CV semble trop court, ajoutez plus de détails');
        }
        
        return suggestions;
    }

    // Get summary statistics
    getSummary(text) {
        return {
            wordCount: tokenizer.tokenize(text).length,
            characterCount: text.length,
            lineCount: text.split('\n').length,
            hasEducation: text.toLowerCase().includes('education') || text.toLowerCase().includes('formation'),
            hasExperience: text.toLowerCase().includes('experience') || text.toLowerCase().includes('expérience'),
            hasSkills: text.toLowerCase().includes('skill') || text.toLowerCase().includes('compétence'),
            hasLanguages: text.toLowerCase().includes('langue') || text.toLowerCase().includes('language')
        };
    }
}

module.exports = new NLPService();