import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create sample users
  const user1 = await db.user.create({
    data: {
      email: 'demo@example.com',
      name: 'Demo User',
    },
  })

  console.log('✅ Created demo user:', user1.email)

  // Create sample prompts
  const samplePrompts = [
    {
      title: 'Generate Code Documentation',
      content: 'Please generate comprehensive documentation for the following code:\n\n{CODE}\n\nInclude:\n- Function/method descriptions\n- Parameter explanations\n- Return value descriptions\n- Usage examples\n- Any important notes or warnings',
      description: 'A prompt for generating detailed code documentation',
      isFavorite: true,
    },
    {
      title: 'Code Review Assistant',
      content: 'Please review the following code and provide feedback on:\n\n{CODE}\n\n1. Code quality and readability\n2. Potential bugs or issues\n3. Performance optimizations\n4. Best practices adherence\n5. Suggestions for improvement',
      description: 'A comprehensive code review prompt',
      isFavorite: false,
    },
    {
      title: 'Explain Complex Concept',
      content: 'Please explain the following concept in simple terms:\n\n{CONCEPT}\n\nBreak it down into:\n1. Basic definition\n2. Key components or parts\n3. How it works\n4. Real-world examples\n5. Why it\'s important',
      description: 'Help explain complex topics in an understandable way',
      isFavorite: true,
    },
    {
      title: 'Meeting Summary Generator',
      content: 'Please create a comprehensive summary of the following meeting notes:\n\n{MEETING_NOTES}\n\nInclude:\n- Key discussion points\n- Decisions made\n- Action items with owners\n- Next steps\n- Important deadlines',
      description: 'Generate structured meeting summaries',
      isFavorite: false,
    },
    {
      title: 'Email Composer',
      content: 'Please help me compose a professional email with the following details:\n\nRecipient: {RECIPIENT}\nSubject: {SUBJECT}\nPurpose: {PURPOSE}\nKey Points: {KEY_POINTS}\nTone: {TONE}\n\nCreate a well-structured, professional email that clearly communicates the message.',
      description: 'Compose professional emails efficiently',
      isFavorite: false,
    },
    {
      title: 'Bug Report Template',
      content: 'Create a detailed bug report with the following information:\n\n**Bug Description:** {BUG_DESCRIPTION}\n**Steps to Reproduce:** {STEPS}\n**Expected Behavior:** {EXPECTED}\n**Actual Behavior:** {ACTUAL}\n**Environment:** {ENVIRONMENT}\n**Additional Notes:** {NOTES}\n\nFormat this as a clear, actionable bug report.',
      description: 'Template for creating structured bug reports',
      isFavorite: true,
    },
    {
      title: 'Creative Writing Prompt',
      content: 'Write a creative piece based on the following prompt:\n\n{CREATIVE_PROMPT}\n\nStyle: {STYLE}\nLength: {LENGTH}\nTone: {TONE}\n\nFocus on vivid descriptions, character development, and engaging storytelling.',
      description: 'Generate creative writing based on prompts',
      isFavorite: false,
    },
    {
      title: 'Data Analysis Prompt',
      content: 'Analyze the following data and provide insights:\n\n{DATA}\n\nPlease provide:\n1. Key trends and patterns\n2. Statistical insights\n3. Potential correlations\n4. Actionable recommendations\n5. Data visualization suggestions',
      description: 'Comprehensive data analysis and insights',
      isFavorite: true,
    },
  ]

  for (const promptData of samplePrompts) {
    const prompt = await db.prompt.create({
      data: promptData,
    })
    console.log('✅ Created prompt:', prompt.title)
  }

  console.log('🎉 Database seeding completed successfully!')
  console.log(`📊 Created ${samplePrompts.length} sample prompts`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
