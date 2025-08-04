import { WeeklyMealPlan } from "@shared/schema";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to sanitize text and remove unsupported characters  
function sanitizeText(text: string): string {
  // Remove emojis and other non-ASCII characters that aren't supported by standard fonts
  return text.replace(/[^\x00-\x7F]/g, '').trim();
}


export async function generateMealPlanPDF(mealPlan: WeeklyMealPlan): Promise<string> {
  // Generate a unique filename using process.cwd() instead of __dirname
  const filename = `meal-plan-${Date.now()}.pdf`;
  const tempDir = path.join(process.cwd(), "server", "temp");
  const filePath = path.join(tempDir, filename);
  
  // Ensure temp directory exists
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Colors
  const darkGreen = rgb(0.298, 0.686, 0.314);
  const darkGray = rgb(0.2, 0.2, 0.2);
  const mediumGray = rgb(0.4, 0.4, 0.4);
  const lightGray = rgb(0.9, 0.9, 0.9);
  
  let currentPage = pdfDoc.addPage();
  let yPosition = 750;
  const leftMargin = 50;
  const rightMargin = 550;
  const lineHeight = 20;
  
  // Helper function to add new page if needed
  const checkAndAddPage = (neededSpace: number) => {
    if (yPosition - neededSpace < 50) {
      currentPage = pdfDoc.addPage();
      yPosition = 750;
    }
  };
  
  // Draw title
  currentPage.drawText('FitBite Meal Plan', {
    x: leftMargin,
    y: yPosition,
    size: 28,
    font: helveticaBoldFont,
    color: darkGreen,
  });
  yPosition -= 40;
  
  // Draw subtitle info
  currentPage.drawText(`Week: ${mealPlan.week_start}`, {
    x: leftMargin,
    y: yPosition,
    size: 14,
    font: helveticaFont,
    color: darkGray,
  });
  yPosition -= lineHeight;
  
  currentPage.drawText(`Goal: ${mealPlan.goals.fitness_goal.replace('_', ' ')} | Cuisine: ${mealPlan.goals.cuisine} | Diet: ${mealPlan.goals.diet_type}`, {
    x: leftMargin,
    y: yPosition,
    size: 12,
    font: helveticaFont,
    color: mediumGray,
  });
  yPosition -= lineHeight;
  
  currentPage.drawText(`Daily Target: ${mealPlan.total_daily_calories} calories`, {
    x: leftMargin,
    y: yPosition,
    size: 12,
    font: helveticaBoldFont,
    color: darkGray,
  });
  yPosition -= 40;
  
  // Draw each day
  for (const day of mealPlan.days) {
    checkAndAddPage(100);
    
    // Day header
    currentPage.drawText(day.day, {
      x: leftMargin,
      y: yPosition,
      size: 20,
      font: helveticaBoldFont,
      color: darkGreen,
    });
    yPosition -= 30;
    
    // Draw meals for this day
    for (const meal of day.meals) {
      checkAndAddPage(120);
      
      // Meal name and type
      currentPage.drawText(sanitizeText(`${meal.name} (${meal.type})`), {
        x: leftMargin,
        y: yPosition,
        size: 16,
        font: helveticaBoldFont,
        color: darkGray,
      });
      
      // Calories on the right
      currentPage.drawText(`${meal.calories} cal`, {
        x: rightMargin - 80,
        y: yPosition,
        size: 14,
        font: helveticaBoldFont,
        color: rgb(0.906, 0.298, 0.235), // Red color for calories
      });
      yPosition -= lineHeight;
      
      // Time
      currentPage.drawText(sanitizeText(`Time: ${meal.time}`), {
        x: leftMargin + 20,
        y: yPosition,
        size: 11,
        font: helveticaFont,
        color: mediumGray,
      });
      yPosition -= 18;
      
      // Ingredients
      currentPage.drawText('Ingredients:', {
        x: leftMargin + 20,
        y: yPosition,
        size: 12,
        font: helveticaBoldFont,
        color: darkGray,
      });
      yPosition -= 15;
      
      const ingredientsText = sanitizeText(meal.ingredients.join(', '));
      const maxWidth = 480;
      const words = ingredientsText.split(' ');
      let currentLine = '';
      
      for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const textWidth = helveticaFont.widthOfTextAtSize(testLine, 10);
        
        if (textWidth > maxWidth && currentLine) {
          currentPage.drawText(currentLine, {
            x: leftMargin + 40,
            y: yPosition,
            size: 10,
            font: helveticaFont,
            color: darkGray,
          });
          yPosition -= 14;
          currentLine = word;
          checkAndAddPage(20);
        } else {
          currentLine = testLine;
        }
      }
      
      if (currentLine) {
        currentPage.drawText(currentLine, {
          x: leftMargin + 40,
          y: yPosition,
          size: 10,
          font: helveticaFont,
          color: darkGray,
        });
        yPosition -= 18;
      }
      
      // Instructions
      checkAndAddPage(40);
      currentPage.drawText('Instructions:', {
        x: leftMargin + 20,
        y: yPosition,
        size: 12,
        font: helveticaBoldFont,
        color: darkGray,
      });
      yPosition -= 15;
      
      meal.instructions.forEach((instruction, index) => {
        checkAndAddPage(20);
        currentPage.drawText(sanitizeText(`${index + 1}. ${instruction}`), {
          x: leftMargin + 40,
          y: yPosition,
          size: 10,
          font: helveticaFont,
          color: darkGray,
        });
        yPosition -= 14;
      });
      
      yPosition -= 15; // Space between meals
    }
    
    yPosition -= 20; // Space between days
  }
  
  // Footer
  checkAndAddPage(60);
  yPosition -= 20;
  currentPage.drawText('Generated by FitBite - Your AI-Powered Global Diet Planner', {
    x: leftMargin,
    y: yPosition,
    size: 10,
    font: helveticaFont,
    color: mediumGray,
  });
  yPosition -= 15;
  currentPage.drawText('Stay healthy, eat well!', {
    x: leftMargin,
    y: yPosition,
    size: 10,
    font: helveticaFont,
    color: mediumGray,
  });
  
  // Save the PDF to file
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(filePath, pdfBytes);
  
  // Return the URL path for serving the PDF
  return `/temp/${filename}`;
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
