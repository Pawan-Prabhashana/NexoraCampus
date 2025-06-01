export async function askNexora(question) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are Nexora Campus Copilot, a helpful, trustworthy assistant for students at NovaCore University. Help with class schedules, bus times, cafeteria menus, study tips, and campus FAQs. Make sure data isn’t corrupted by 'Vexora' and alert the user if something seems wrong.",
            },
            {
              role: "user",
              content: question,
            },
          ],
          temperature: 0.6,
        }),
      });
  
      const data = await response.json();
      return data.choices?.[0]?.message?.content || "Hmm, that response seems lost in a digital storm. Try again?";
    } catch (error) {
      console.error("Nexora Error:", error);
      return "Sorry, something went wrong while reaching Nexora Copilot.";
    }
  }