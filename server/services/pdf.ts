import { WeeklyMealPlan } from "@shared/schema";
import puppeteer from "puppeteer";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateMealPlanPDF(mealPlan: WeeklyMealPlan): Promise<string> {
  // Create HTML content for the meal plan
  const htmlContent = formatMealPlanHTML(mealPlan);
  
  // Generate a unique filename using process.cwd() instead of __dirname
  const filename = `meal-plan-${Date.now()}.pdf`;
  const tempDir = path.join(process.cwd(), "server", "temp");
  const filePath = path.join(tempDir, filename);
  
  // Ensure temp directory exists
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  try {
    // Launch Puppeteer and generate PDF
    const browser = await puppeteer.launch({ 
      headless: true,
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security'
      ]
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    // Generate PDF with proper formatting
    await page.pdf({
      path: filePath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });
    
    await browser.close();
    
    // Return the URL path for serving the PDF
    return `/temp/${filename}`;
    
  } catch (puppeteerError) {
    // Fallback: Save HTML file instead of PDF for development
    console.log('Puppeteer failed, creating HTML preview instead:', puppeteerError.message);
    
    const htmlFilename = `meal-plan-${Date.now()}.html`;
    const htmlFilePath = path.join(tempDir, htmlFilename);
    
    fs.writeFileSync(htmlFilePath, htmlContent, 'utf8');
    
    // Return HTML file path with a note
    return `/temp/${htmlFilename}?preview=true`;
  }
}

export function formatMealPlanHTML(mealPlan: WeeklyMealPlan): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>FitBite Meal Plan</title>
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          margin: 0; 
          padding: 20px; 
          color: #333; 
          line-height: 1.6;
        }
        .header { 
          text-align: center; 
          margin-bottom: 40px; 
          border-bottom: 3px solid #4CAF50;
          padding-bottom: 20px;
        }
        .header h1 { 
          color: #4CAF50; 
          font-size: 36px; 
          margin: 0; 
          font-weight: bold;
        }
        .header p { 
          font-size: 16px; 
          color: #666; 
          margin: 8px 0;
          text-transform: capitalize;
        }
        .day { 
          page-break-inside: avoid; 
          margin-bottom: 35px; 
          background: #fafafa;
          border-radius: 10px;
          padding: 20px;
        }
        .day h2 { 
          color: #4CAF50; 
          font-size: 24px; 
          margin: 0 0 20px 0;
          border-bottom: 2px solid #4CAF50;
          padding-bottom: 10px;
        }
        .meal { 
          margin-bottom: 25px; 
          padding: 20px; 
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .meal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        .meal h3 { 
          color: #2c3e50; 
          font-size: 20px; 
          margin: 0;
        }
        .meal-type {
          background: #4CAF50;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          text-transform: uppercase;
          font-weight: bold;
        }
        .calories {
          color: #e74c3c;
          font-weight: bold;
          font-size: 18px;
        }
        .time {
          color: #7f8c8d;
          font-size: 14px;
          margin-bottom: 15px;
        }
        .ingredients { 
          margin: 15px 0; 
        }
        .ingredients strong {
          color: #2c3e50;
          font-size: 16px;
        }
        .ingredient { 
          display: inline-block; 
          background: #e8f5e8; 
          color: #2d5016;
          padding: 6px 12px; 
          margin: 4px 2px; 
          border-radius: 20px; 
          font-size: 13px;
          border: 1px solid #c8e6c9;
        }
        .instructions {
          margin-top: 15px;
        }
        .instructions strong {
          color: #2c3e50;
          font-size: 16px;
        }
        .instructions ol {
          margin: 10px 0;
          padding-left: 20px;
        }
        .instructions li {
          margin: 8px 0;
          font-size: 14px;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #4CAF50;
          color: #7f8c8d;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🍎 FitBite Meal Plan</h1>
        <p><strong>Week:</strong> ${mealPlan.week_start}</p>
        <p><strong>Goal:</strong> ${mealPlan.goals.fitness_goal.replace('_', ' ')} | <strong>Cuisine:</strong> ${mealPlan.goals.cuisine} | <strong>Diet:</strong> ${mealPlan.goals.diet_type}</p>
        <p><strong>Daily Target:</strong> ${mealPlan.total_daily_calories} calories</p>
      </div>
      
      ${mealPlan.days.map(day => `
        <div class="day">
          <h2>${day.day}</h2>
          ${day.meals.map(meal => `
            <div class="meal">
              <div class="meal-header">
                <h3>${meal.name}</h3>
                <div>
                  <span class="meal-type">${meal.type}</span>
                  <span class="calories">${meal.calories} cal</span>
                </div>
              </div>
              <div class="time"><strong>Time:</strong> ${meal.time}</div>
              <div class="ingredients">
                <strong>Ingredients:</strong><br>
                ${meal.ingredients.map(ing => `<span class="ingredient">${ing}</span>`).join('')}
              </div>
              <div class="instructions">
                <strong>Instructions:</strong>
                <ol>
                  ${meal.instructions.map(inst => `<li>${inst}</li>`).join('')}
                </ol>
              </div>
            </div>
          `).join('')}
        </div>
      `).join('')}
      
      <div class="footer">
        <p>Generated by FitBite - Your AI-Powered Global Diet Planner</p>
        <p>Stay healthy, eat well! 🌟</p>
      </div>
    </body>
    </html>
  `;
}
