const mockData = {
  classes: [
    { course: "CS101", time: "9:00 AM", location: "Room 201" },
    { course: "MA102", time: "11:00 AM", location: "Room 104" }
  ],
  lunch: {
    Monday: ["Rice & Curry", "Vegetable Soup", "Fruit"],
    Tuesday: ["Noodles", "Egg Salad", "Yogurt"]
  },
  buses: [
    { route: "A1", time: "8:00 AM", stop: "Main Gate" },
    { route: "B2", time: "9:30 AM", stop: "Science Block" }
  ],
  tips: [
    "Review notes after each lecture.",
    "Use the Pomodoro technique to stay focused.",
    "Form study groups with classmates."
  ],
  events: [
    { title: "AI Workshop", date: "2025-06-05", location: "Auditorium" },
    { title: "Career Fair", date: "2025-06-12", location: "Main Hall" }
  ]
};

export default function handler(req, res) {
  res.status(200).json(mockData);
}
