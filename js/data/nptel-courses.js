export const NPTEL_COURSES = [
  { id:'ds', name:'Data Science for Engineers', emoji:'📊', weeks:12, qs:480 },
  { id:'dbms', name:'Database Management Systems', emoji:'🗄️', weeks:8, qs:320 },
  { id:'cn', name:'Computer Networks', emoji:'🌐', weeks:10, qs:400 },
  { id:'os', name:'Operating Systems', emoji:'💾', weeks:10, qs:400 },
  { id:'dsa', name:'Data Structures & Algorithms', emoji:'🌳', weeks:12, qs:480 },
  { id:'ml', name:'Machine Learning', emoji:'🤖', weeks:12, qs:480 },
  { id:'dl', name:'Deep Learning', emoji:'🧠', weeks:8, qs:320 },
  { id:'nlp', name:'Natural Language Processing', emoji:'💬', weeks:8, qs:320 },
  { id:'cv', name:'Computer Vision', emoji:'👁️', weeks:8, qs:320 },
  { id:'cloud', name:'Cloud Computing', emoji:'☁️', weeks:8, qs:320 },
  { id:'cyber', name:'Cyber Security', emoji:'🔐', weeks:10, qs:400 },
  { id:'ai', name:'Introduction to AI', emoji:'🤖', weeks:8, qs:320 },
  { id:'iot', name:'Internet of Things', emoji:'📡', weeks:8, qs:320 },
  { id:'bc', name:'Blockchain Technology', emoji:'⛓️', weeks:8, qs:320 },
  { id:'python', name:'Programming in Python', emoji:'🐍', weeks:8, qs:320 },
  { id:'java', name:'Programming in Java', emoji:'☕', weeks:8, qs:320 },
  { id:'c', name:'Programming in C', emoji:'🖥️', weeks:8, qs:320 },
  { id:'se', name:'Software Engineering', emoji:'🔧', weeks:8, qs:320 },
  { id:'toc', name:'Theory of Computation', emoji:'∑', weeks:8, qs:320 },
  { id:'cd', name:'Compiler Design', emoji:'⚙️', weeks:8, qs:320 },
  { id:'coa', name:'Computer Organisation & Architecture', emoji:'🏗️', weeks:10, qs:400 },
  { id:'dld', name:'Digital Logic Design', emoji:'🔌', weeks:8, qs:320 },
  { id:'maths', name:'Discrete Mathematics', emoji:'📐', weeks:8, qs:320 },
  { id:'prob', name:'Probability & Statistics', emoji:'📈', weeks:8, qs:320 },
  { id:'la', name:'Linear Algebra', emoji:'🔢', weeks:6, qs:240 },
];

export function genQuestions(courseId, week) {
  return [
    {
      q: `Which of the following best describes the core concept studied in Week ${week} of ${courseId.toUpperCase()}?`,
      options: ['Option A — Foundational principle', 'Option B — Advanced derivation', 'Option C — Applied technique', 'Option D — Historical context'],
      ans: 0,
    },
    {
      q: `A key algorithm discussed in this topic has a time complexity of:`,
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      ans: 2,
    },
    {
      q: `Which statement about this week's concept is TRUE?`,
      options: ['It applies only to theoretical problems', 'It was developed in the 1990s', 'It is widely used in modern systems', 'It has no practical applications'],
      ans: 2,
    },
  ];
}
