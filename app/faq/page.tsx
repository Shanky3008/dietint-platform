'use client';

import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  tags: string[];
}

const faqData: FAQItem[] = [
  // Getting Started
  {
    id: '1',
    category: 'Getting Started',
    question: 'How do I create an account on NutriConnect?',
    answer: 'Creating an account is simple! Click the "Get Started" button on our homepage, choose whether you\'re a client looking for nutrition guidance or a dietitian offering services, fill in your basic information, verify your email, and complete your profile. For dietitians, additional verification steps ensure professional credentials.',
    tags: ['account', 'registration', 'setup']
  },
  {
    id: '2',
    category: 'Getting Started',
    question: 'What information do I need to provide during registration?',
    answer: 'Clients need basic contact information, health goals, and dietary preferences. Dietitians must provide professional credentials, licenses, education background, and areas of specialization. All users need to create a secure password and verify their email address.',
    tags: ['registration', 'information', 'requirements']
  },
  {
    id: '3',
    category: 'Getting Started',
    question: 'Is my personal health information secure?',
    answer: 'Absolutely! We use enterprise-grade encryption for all data transmission and storage. Our platform is HIPAA-compliant, ensuring your health information is protected according to medical privacy standards. We never share your personal data without your explicit consent.',
    tags: ['security', 'privacy', 'HIPAA', 'data protection']
  },
  
  // For Clients
  {
    id: '4',
    category: 'For Clients',
    question: 'How do I find and choose a dietitian?',
    answer: 'Browse our verified dietitian profiles to see their specializations, experience, client reviews, and available appointment times. You can filter by expertise (weight loss, sports nutrition, medical conditions), location preferences, pricing, and languages spoken. Each dietitian\'s profile includes their background and approach to nutrition counseling.',
    tags: ['dietitians', 'selection', 'profiles', 'specializations']
  },
  {
    id: '5',
    category: 'For Clients',
    question: 'What types of consultations are available?',
    answer: 'We offer three main consultation types: Initial Consultations (60-90 minutes) for comprehensive assessment and plan creation, Follow-up Sessions (30-45 minutes) for progress review and adjustments, and Quick Check-ins (15-20 minutes) for brief questions and support. All sessions can be conducted via secure video calls.',
    tags: ['consultations', 'appointments', 'session types', 'video calls']
  },
  {
    id: '6',
    category: 'For Clients',
    question: 'How much do consultations cost?',
    answer: 'Pricing varies by dietitian and session type. Initial consultations typically range from $75-150, follow-up sessions from $50-100, and quick check-ins from $25-50. Many dietitians offer package deals for multiple sessions. Payment is processed securely through our platform with various payment methods accepted.',
    tags: ['pricing', 'cost', 'payment', 'packages']
  },
  {
    id: '7',
    category: 'For Clients',
    question: 'What happens during my first appointment?',
    answer: 'Your initial consultation includes a comprehensive health assessment, discussion of your goals and challenges, review of your current eating habits, medical history review, and creation of a personalized nutrition plan. Your dietitian will also explain next steps and schedule follow-up appointments as needed.',
    tags: ['first appointment', 'consultation', 'assessment', 'nutrition plan']
  },
  {
    id: '8',
    category: 'For Clients',
    question: 'How do I access my personalized diet plan?',
    answer: 'Your custom diet plan is available in your dashboard immediately after your dietitian creates it. The plan includes daily meal suggestions, recipes, shopping lists, nutritional targets, and progress tracking tools. You can access it through our website or mobile app, even when offline.',
    tags: ['diet plan', 'access', 'dashboard', 'mobile app']
  },
  {
    id: '9',
    category: 'For Clients',
    question: 'Can I modify my diet plan if I don\'t like certain foods?',
    answer: 'Absolutely! Your diet plan is fully customizable. You can swap meals, exclude ingredients you dislike, account for allergies or dietary restrictions, and request alternatives. Your dietitian can also adjust the plan based on your feedback and preferences during follow-up sessions.',
    tags: ['customization', 'modifications', 'preferences', 'allergies']
  },
  
  // For Dietitians
  {
    id: '10',
    category: 'For Dietitians',
    question: 'What credentials do I need to become a verified dietitian?',
    answer: 'You need a valid dietitian license or registration from your jurisdiction, professional liability insurance, relevant educational degrees, and current continuing education records. We verify all credentials before approving your professional profile.',
    tags: ['credentials', 'verification', 'requirements', 'professional']
  },
  {
    id: '11',
    category: 'For Dietitians',
    question: 'How do I set my availability and pricing?',
    answer: 'In your admin dashboard, go to Settings to configure your weekly schedule, time zones, appointment types, and pricing for each service. You can set different rates for different consultation types and create package deals. The system handles all booking and payment processing automatically.',
    tags: ['availability', 'pricing', 'schedule', 'settings']
  },
  {
    id: '12',
    category: 'For Dietitians',
    question: 'How do payments work for dietitians?',
    answer: 'We handle all payment processing securely. Clients pay through our platform, and you receive payments (minus our service fee) via direct deposit or your preferred payment method. You\'ll receive detailed revenue reports and tax documentation for your records.',
    tags: ['payments', 'revenue', 'fees', 'tax documentation']
  },
  {
    id: '13',
    category: 'For Dietitians',
    question: 'What tools are available for creating diet plans?',
    answer: 'Our comprehensive diet plan builder includes a recipe database with nutritional analysis, customizable meal templates, automatic grocery list generation, macro and calorie calculators, and accommodation tools for dietary restrictions. You can create plans from scratch or modify existing templates.',
    tags: ['diet plans', 'tools', 'recipes', 'templates']
  },
  
  // Technical Support
  {
    id: '14',
    category: 'Technical Support',
    question: 'Is there a mobile app available?',
    answer: 'Yes! We offer both a native Android app (APK download) and a Progressive Web App (PWA) for iOS devices. The mobile app includes offline access to diet plans, quick meal logging, progress tracking, appointment notifications, and secure messaging with your dietitian.',
    tags: ['mobile app', 'Android', 'iOS', 'offline access']
  },
  {
    id: '15',
    category: 'Technical Support',
    question: 'How do I install the mobile app?',
    answer: 'For Android: Download the APK file, enable installation from unknown sources in your security settings, and install. For iOS: Open nutriconnect.com in Safari, tap the share button, and select "Add to Home Screen" to install the web app.',
    tags: ['installation', 'mobile app', 'Android APK', 'iOS PWA']
  },
  {
    id: '16',
    category: 'Technical Support',
    question: 'What browsers are supported?',
    answer: 'NutriConnect works best on modern browsers including Chrome (recommended), Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience and security. The video calling feature requires camera and microphone permissions.',
    tags: ['browsers', 'compatibility', 'requirements', 'video calls']
  },
  {
    id: '17',
    category: 'Technical Support',
    question: 'I\'m having trouble with video calls. What should I do?',
    answer: 'First, check your internet connection and ensure your browser has camera/microphone permissions. Close other applications that might be using your camera. If issues persist, try refreshing the page or switching browsers. Contact our technical support for persistent problems.',
    tags: ['video calls', 'troubleshooting', 'technical issues', 'permissions']
  },
  
  // Account Management
  {
    id: '18',
    category: 'Account Management',
    question: 'How do I reset my password?',
    answer: 'Click "Forgot Password" on the login page, enter your email address, check your inbox for a reset link, click the link and create a new password. If you don\'t receive the email, check your spam folder or contact support.',
    tags: ['password reset', 'login issues', 'account access']
  },
  {
    id: '19',
    category: 'Account Management',
    question: 'Can I change my email address?',
    answer: 'Yes, you can update your email address in your account settings. You\'ll need to verify the new email address before the change takes effect. This ensures your account security and that you continue receiving important notifications.',
    tags: ['email change', 'account settings', 'verification']
  },
  {
    id: '20',
    category: 'Account Management',
    question: 'How do I delete my account?',
    answer: 'To delete your account, go to Settings > Account > Delete Account. This action is permanent and will remove all your data. If you\'re a client with active appointments, please reschedule or cancel them first. For dietitians, ensure all client obligations are fulfilled.',
    tags: ['account deletion', 'data removal', 'permanent action']
  },
  {
    id: '21',
    category: 'Account Management',
    question: 'Can I export my data?',
    answer: 'Yes! You can export your personal data including profile information, diet plans, progress tracking, appointment history, and communication logs. Go to Settings > Export Data, choose your preferred format (JSON, CSV, or PDF), and you\'ll receive a download link via email.',
    tags: ['data export', 'privacy rights', 'data portability']
  },
  
  // Billing and Payments
  {
    id: '22',
    category: 'Billing and Payments',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit and debit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and direct bank transfers. All payments are processed securely with enterprise-grade encryption.',
    tags: ['payment methods', 'credit cards', 'digital wallets', 'security']
  },
  {
    id: '23',
    category: 'Billing and Payments',
    question: 'When am I charged for appointments?',
    answer: 'Payment is typically processed immediately upon booking confirmation. For package deals or recurring appointments, you may be charged according to the agreed schedule. You\'ll always receive an invoice via email for your records.',
    tags: ['billing timing', 'payment processing', 'invoices']
  },
  {
    id: '24',
    category: 'Billing and Payments',
    question: 'What is your cancellation and refund policy?',
    answer: 'You can cancel appointments up to 24 hours in advance for a full refund. Cancellations within 24 hours may incur a fee, depending on your dietitian\'s policy. Emergency cancellations are handled case-by-case. Package deals have specific terms outlined at purchase.',
    tags: ['cancellation', 'refund policy', '24 hour rule', 'emergency']
  },
  {
    id: '25',
    category: 'Billing and Payments',
    question: 'Do you accept insurance?',
    answer: 'Currently, we don\'t directly bill insurance companies, but we provide detailed receipts that you can submit to your insurance provider for potential reimbursement. Many HSA and FSA accounts can be used for our services. Check with your provider for coverage details.',
    tags: ['insurance', 'reimbursement', 'HSA', 'FSA', 'receipts']
  },
  
  // Privacy and Security
  {
    id: '26',
    category: 'Privacy and Security',
    question: 'How do you protect my personal information?',
    answer: 'We use end-to-end encryption for all communications, secure cloud storage with enterprise-grade security, regular security audits, HIPAA-compliant data handling, and strict access controls. Your data is never shared without your explicit consent.',
    tags: ['data protection', 'encryption', 'HIPAA', 'security audits']
  },
  {
    id: '27',
    category: 'Privacy and Security',
    question: 'Who can see my health information?',
    answer: 'Only you and the dietitians you\'ve specifically chosen to work with can access your health information. Our platform administrators can only access technical data needed for system maintenance. We never share personal health data with third parties without your consent.',
    tags: ['access control', 'health information', 'privacy', 'consent']
  },
  {
    id: '28',
    category: 'Privacy and Security',
    question: 'Can I control what information is shared?',
    answer: 'Yes! You have complete control over your information sharing. You can choose which dietitians to share information with, what specific data to include, and revoke access at any time. Your privacy settings are easily managed in your account dashboard.',
    tags: ['privacy controls', 'data sharing', 'consent management']
  }
];

const categories = ['All', 'Getting Started', 'For Clients', 'For Dietitians', 'Technical Support', 'Account Management', 'Billing and Payments', 'Privacy and Security'];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const filteredFAQs = faqData.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-blue-100">
            Find answers to common questions about NutriConnect
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search FAQs..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No FAQs found matching your search.</p>
              <p className="text-gray-400 mt-2">Try adjusting your search terms or browse different categories.</p>
            </div>
          ) : (
            filteredFAQs.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {item.question}
                    </h3>
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                      {item.category}
                    </span>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    {openItems.has(item.id) ? (
                      <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </button>
                
                {openItems.has(item.id) && (
                  <div className="px-6 pb-4">
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-gray-700 leading-relaxed">
                        {item.answer}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Contact Support */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for? Our support team is here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@dietint.com"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Email Support
            </a>
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 border border-blue-600 text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Contact Us
            </a>
          </div>
          
          <div className="mt-6 text-sm text-gray-500">
            <p>📧 Email: support@dietint.com</p>
            <p>📞 Phone: 1-800-DIET-INT</p>
            <p>⏰ Hours: Monday-Friday, 9 AM - 6 PM EST</p>
          </div>
        </div>
      </div>
    </div>
  );
}