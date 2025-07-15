// database-content-setup.js - Setup content management tables
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

async function setupContentTables() {
    console.log('🗄️  Setting up content management database...');
    
    const db = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });

    // Create content table for dynamic content
    await db.exec(`
        CREATE TABLE IF NOT EXISTS content (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            section TEXT NOT NULL,
            content_key TEXT NOT NULL,
            content_value TEXT NOT NULL,
            content_type TEXT DEFAULT 'text',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Create a composite unique index for section + content_key
    await db.exec(`
        CREATE UNIQUE INDEX IF NOT EXISTS idx_content_section_key 
        ON content(section, content_key)
    `);

    // Insert default content if table is empty
    const existingContent = await db.get('SELECT COUNT(*) as count FROM content');
    
    if (existingContent.count === 0) {
        console.log('📝 Inserting default content...');
        
        const defaultContent = [
            // Hero Section
            { section: 'hero', content_key: 'title', content_value: 'Transform Your Health with Expert Nutrition Guidance' },
            { section: 'hero', content_key: 'subtitle', content_value: 'Personalized diet plans and expert consultations' },
            { section: 'hero', content_key: 'description', content_value: 'Connect with certified dietitians, track your nutrition progress, and achieve your health goals with personalized diet plans.' },
            { section: 'hero', content_key: 'cta_primary', content_value: 'Get Started Today' },
            { section: 'hero', content_key: 'cta_secondary', content_value: 'Learn More' },

            // App Branding
            { section: 'branding', content_key: 'app_name', content_value: 'NutriWise' },
            { section: 'branding', content_key: 'tagline', content_value: 'Personalized diet plans and expert consultations' },
            { section: 'branding', content_key: 'description', content_value: 'Your personal nutrition companion for achieving optimal health' },

            // Features Section
            { section: 'features', content_key: 'title', content_value: 'Why Choose Our Platform?' },
            { section: 'features', content_key: 'subtitle', content_value: 'Everything you need for your nutrition journey' },
            
            // Feature Cards
            { section: 'feature_1', content_key: 'icon', content_value: '🩺' },
            { section: 'feature_1', content_key: 'title', content_value: 'Expert Dietitians' },
            { section: 'feature_1', content_key: 'description', content_value: 'Certified nutrition professionals with years of experience' },
            
            { section: 'feature_2', content_key: 'icon', content_value: '📋' },
            { section: 'feature_2', content_key: 'title', content_value: 'Personalized Plans' },
            { section: 'feature_2', content_key: 'description', content_value: 'Custom diet plans tailored to your goals and preferences' },
            
            { section: 'feature_3', content_key: 'icon', content_value: '📱' },
            { section: 'feature_3', content_key: 'title', content_value: 'Easy Tracking' },
            { section: 'feature_3', content_key: 'description', content_value: 'Monitor your progress with our intuitive tracking tools' },
            
            { section: 'feature_4', content_key: 'icon', content_value: '🎯' },
            { section: 'feature_4', content_key: 'title', content_value: 'Goal Achievement' },
            { section: 'feature_4', content_key: 'description', content_value: 'Reach your health goals with expert guidance and support' },

            // Services Section
            { section: 'services', content_key: 'title', content_value: 'Our Services' },
            { section: 'services', content_key: 'subtitle', content_value: 'Comprehensive nutrition solutions for every need' },
            
            // Service Items
            { section: 'service_1', content_key: 'icon', content_value: '💬' },
            { section: 'service_1', content_key: 'title', content_value: 'One-on-One Consultations' },
            { section: 'service_1', content_key: 'description', content_value: 'Personal consultations with certified dietitians via video call' },
            { section: 'service_1', content_key: 'price', content_value: '$75/session' },
            
            { section: 'service_2', content_key: 'icon', content_value: '📊' },
            { section: 'service_2', content_key: 'title', content_value: 'Nutrition Analysis' },
            { section: 'service_2', content_key: 'description', content_value: 'Comprehensive analysis of your current diet and nutrition habits' },
            { section: 'service_2', content_key: 'price', content_value: '$45/analysis' },
            
            { section: 'service_3', content_key: 'icon', content_value: '🥗' },
            { section: 'service_3', content_key: 'title', content_value: 'Custom Meal Plans' },
            { section: 'service_3', content_key: 'description', content_value: 'Personalized meal plans designed for your specific goals' },
            { section: 'service_3', content_key: 'price', content_value: '$29/month' },

            // Testimonials Section
            { section: 'testimonials', content_key: 'title', content_value: 'What Our Clients Say' },
            { section: 'testimonials', content_key: 'subtitle', content_value: 'Real stories from people who achieved their goals' },
            
            // Testimonial Items
            { section: 'testimonial_1', content_key: 'name', content_value: 'Sarah Johnson' },
            { section: 'testimonial_1', content_key: 'role', content_value: 'Fitness Enthusiast' },
            { section: 'testimonial_1', content_key: 'content', content_value: 'The personalized diet plan helped me lose 20 pounds in 3 months. The dietitians were incredibly supportive throughout my journey.' },
            { section: 'testimonial_1', content_key: 'rating', content_value: '5' },
            { section: 'testimonial_1', content_key: 'avatar', content_value: 'SJ' },
            
            { section: 'testimonial_2', content_key: 'name', content_value: 'Mike Chen' },
            { section: 'testimonial_2', content_key: 'role', content_value: 'Busy Professional' },
            { section: 'testimonial_2', content_key: 'content', content_value: 'As a busy professional, I needed a simple solution. The meal planning feature saved me hours each week while improving my health.' },
            { section: 'testimonial_2', content_key: 'rating', content_value: '5' },
            { section: 'testimonial_2', content_key: 'avatar', content_value: 'MC' },
            
            { section: 'testimonial_3', content_key: 'name', content_value: 'Emily Rodriguez' },
            { section: 'testimonial_3', content_key: 'role', content_value: 'New Mom' },
            { section: 'testimonial_3', content_key: 'content', content_value: 'Post-pregnancy nutrition was challenging. The expert guidance helped me regain my energy and confidence.' },
            { section: 'testimonial_3', content_key: 'rating', content_value: '5' },
            { section: 'testimonial_3', content_key: 'avatar', content_value: 'ER' },

            // Contact Information
            { section: 'contact', content_key: 'email', content_value: 'contact@dietint.com' },
            { section: 'contact', content_key: 'phone', content_value: '+1 (555) 123-DIET' },
            { section: 'contact', content_key: 'address', content_value: '123 Health Street, Wellness City, WC 12345' },
            { section: 'contact', content_key: 'hours', content_value: 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM' },

            // Footer Information
            { section: 'footer', content_key: 'copyright', content_value: '© 2024 NutriWise. All rights reserved.' },
            { section: 'footer', content_key: 'business_name', content_value: 'NutriWise Nutrition Services' },
            { section: 'footer', content_key: 'description', content_value: 'Professional nutrition counseling and wellness services' },

            // About Section
            { section: 'about', content_key: 'title', content_value: 'About NutriWise' },
            { section: 'about', content_key: 'description', content_value: 'We are dedicated to helping you achieve optimal health through personalized nutrition guidance and expert support.' },
            { section: 'about', content_key: 'mission', content_value: 'To make professional nutrition counseling accessible and effective for everyone.' },
            { section: 'about', content_key: 'vision', content_value: 'A world where everyone has access to personalized nutrition guidance for optimal health.' }
        ];

        // Insert all default content
        const insertStmt = await db.prepare(`
            INSERT INTO content (section, content_key, content_value) 
            VALUES (?, ?, ?)
        `);

        for (const item of defaultContent) {
            await insertStmt.run(item.section, item.content_key, item.content_value);
        }

        await insertStmt.finalize();
        console.log(`✅ Inserted ${defaultContent.length} content items`);
    } else {
        console.log('📄 Content table already has data');
    }

    await db.close();
    console.log('✅ Content management database setup complete!');
}

// Run if called directly
if (require.main === module) {
    setupContentTables().catch(console.error);
}

module.exports = { setupContentTables };