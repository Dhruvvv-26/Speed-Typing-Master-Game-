 // DOM Elements
 const textDisplay = document.getElementById('text-display');
 const typingArea = document.getElementById('typing-area');
 const startBtn = document.getElementById('start-btn');
 const resetBtn = document.getElementById('reset-btn');
 const timerElement = document.getElementById('timer');
 const wpmElement = document.getElementById('wpm');
 const cpmElement = document.getElementById('cpm');
 const accuracyElement = document.getElementById('accuracy');
 const progressBar = document.getElementById('progress-bar');
 const resultModal = document.getElementById('result-modal');
 const resultWpm = document.getElementById('result-wpm');
 const resultCpm = document.getElementById('result-cpm');
 const resultAccuracy = document.getElementById('result-accuracy');
 const resultTime = document.getElementById('result-time');
 const closeModalBtn = document.getElementById('close-modal-btn');
 const difficultyBtns = document.querySelectorAll('.difficulty-btn');

 // Texts for different difficulty levels
 const texts = {
   easy: [
     "The quick brown fox jumps over the lazy dog.",
     "Programming is fun and rewarding when you practice regularly.",
     "Learning to type quickly can save you hours of work time.",
     "Web development involves HTML, CSS, and JavaScript.",
     "Consistent practice is the key to improving your skills.",
     "The sun sets in the west and rises in the east.",
     "Reading books can expand your vocabulary and knowledge.",
     "Music is a universal language that everyone can enjoy.",
     "Regular exercise is important for maintaining good health.",
     "A balanced diet includes fruits, vegetables, and proteins."
   ],
   medium: [
     "JavaScript is a high-level, interpreted programming language that conforms to the ECMAScript specification.",
     "React is a free and open-source front-end JavaScript library for building user interfaces based on UI components.",
     "The Internet of Things (IoT) is a system of interrelated computing devices with the ability to transfer data over a network.",
     "Artificial Intelligence is changing how we interact with technology and is becoming more integrated into our daily lives.",
     "Cloud computing is the on-demand availability of computer system resources, especially data storage and computing power.",
     "Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks that aim to access data.",
     "Machine learning is a method of data analysis that automates analytical model building using algorithms that learn from data.",
     "Responsive web design is an approach to web design that makes web pages render well on a variety of devices and window sizes.",
     "A content management system is software that helps users create, manage, and modify content on a website without specialized technical knowledge.",
     "Version control systems are software tools that help software teams manage changes to source code over time."
   ],
   hard: [
     "Quantum computing is a type of computation that harnesses the collective properties of quantum states, such as superposition, interference, and entanglement, to perform calculations.",
     "The technological singularity is a hypothetical point in time at which technological growth becomes uncontrollable and irreversible, resulting in unforeseeable changes to human civilization.",
     "Neuroplasticity refers to the brain's ability to reorganize itself by forming new neural connections throughout life, allowing the neurons in the brain to compensate for injury and disease.",
     "Cryptocurrency operates on a distributed public ledger called blockchain, which is a record of all transactions updated and held by currency holders.",
     "The principles of object-oriented programming involve encapsulation, abstraction, inheritance, and polymorphism, which are fundamental to many modern programming languages.",
     "In theoretical physics, string theory is a theoretical framework in which the point-like particles of particle physics are replaced by one-dimensional objects called strings.",
     "Bioinformatics combines biology, computer science, mathematics, and statistics to analyze and interpret biological data, particularly large and complex data sets.",
     "The Internet Protocol Suite, commonly known as TCP/IP, is the conceptual model and set of communications protocols used in the Internet and similar computer networks.",
     "Neural networks are computing systems with interconnected nodes that process information by responding to external inputs, relying heavily on learning from examples without task-specific programming.",
     "The quantum entanglement phenomenon occurs when pairs or groups of particles are generated, interact, or share spatial proximity in such a way that the quantum state of each particle cannot be described independently."
   ]
 };

 // Game state
 let currentText = '';
 let timer;
 let timeLeft = 60;
 let isTyping = false;
 let startTime;
 let wordCount = 0;
 let charCount = 0;
 let correctChars = 0;
 let currentIndex = 0;
 let currentDifficulty = 'easy';
 let currentWordIndex = 0;

 // Event listeners
 startBtn.addEventListener('click', startGame);
 resetBtn.addEventListener('click', resetGame);
 typingArea.addEventListener('input', checkTyping);
 closeModalBtn.addEventListener('click', closeModal);
 
 // Add event listeners to difficulty buttons
 difficultyBtns.forEach(btn => {
   btn.addEventListener('click', () => {
     difficultyBtns.forEach(b => b.classList.remove('active'));
     btn.classList.add('active');
     currentDifficulty = btn.dataset.difficulty;
     if (!isTyping) {
       generateText();
     }
   });
 });

 // Initialize the game
 generateText();

 // Generate random text based on difficulty
 function generateText() {
   const textArray = texts[currentDifficulty];
   const randomIndex = Math.floor(Math.random() * textArray.length);
   currentText = textArray[randomIndex];
   
   // Break text into spans for individual character tracking
   textDisplay.innerHTML = '';
   currentText.split('').forEach((char, index) => {
     const span = document.createElement('span');
     span.textContent = char;
     span.dataset.index = index;
     textDisplay.appendChild(span);
   });

   // Update word count
   updateStats();
 }

 // Start the game
 function startGame() {
   if (isTyping) return;
   
   isTyping = true;
   typingArea.disabled = false;
   typingArea.focus();
   startBtn.disabled = true;
   resetBtn.disabled = false;
   
   // Reset stats
   currentIndex = 0;
   correctChars = 0;
   startTime = new Date().getTime();
   timeLeft = 60;
   
   // Reset display
   generateText();
   typingArea.value = '';
   
   // Start timer
   timer = setInterval(() => {
     timeLeft--;
     timerElement.textContent = timeLeft;
     
     // Update progress bar
     const progress = 100 - (timeLeft / 60 * 100);
     progressBar.style.width = `${progress}%`;
     
     if (timeLeft <= 10) {
       timerElement.style.color = '#f87171';
     }
     
     if (timeLeft <= 0) {
       endGame();
     }
   }, 1000);
 }

 // End the game
 function endGame() {
   clearInterval(timer);
   isTyping = false;
   typingArea.disabled = true;
   startBtn.disabled = false;
   
   const totalTime = (new Date().getTime() - startTime) / 1000;
   const minutes = totalTime / 60;
   
   // Final calculations
   const finalWPM = Math.round(wordCount / minutes);
   const finalCPM = Math.round(charCount / minutes);
   const finalAccuracy = charCount > 0 ? Math.round((correctChars / charCount) * 100) : 0;
   
   // Update result modal
   resultWpm.textContent = finalWPM;
   resultCpm.textContent = finalCPM;
   resultAccuracy.textContent = `${finalAccuracy}%`;
   resultTime.textContent = `${Math.round(totalTime)}s`;
   
   // Show modal with results
   resultModal.classList.add('show');
 }

 // Reset the game
 function resetGame() {
   clearInterval(timer);
   isTyping = false;
   typingArea.disabled = true;
   typingArea.value = '';
   startBtn.disabled = false;
   resetBtn.disabled = true;
   timeLeft = 60;
   timerElement.textContent = timeLeft;
   timerElement.style.color = '';
   progressBar.style.width = '0%';
   
   // Reset stats
   wordCount = 0;
   charCount = 0;
   correctChars = 0;
   currentIndex = 0;
   
   // Generate new text
   generateText();
   
   // Reset display
   wpmElement.textContent = '0';
   cpmElement.textContent = '0';
   accuracyElement.textContent = '0%';
 }

 // Check typing progress
 function checkTyping() {
   if (!isTyping) return;
   
   const typedText = typingArea.value;
   charCount = typedText.length;
   currentIndex = typedText.length - 1;
   
   // Clear previous classes
   Array.from(textDisplay.children).forEach(span => {
     span.classList.remove('current', 'correct', 'incorrect');
   });
   
   // Check each character
   correctChars = 0;
   for (let i = 0; i < typedText.length; i++) {
     const span = textDisplay.children[i];
     if (!span) break;
     
     if (typedText[i] === span.textContent) {
       span.classList.add('correct');
       correctChars++;
     } else {
       span.classList.add('incorrect');
     }
   }
   
   // Set current character
   if (textDisplay.children[typedText.length]) {
     textDisplay.children[typedText.length].classList.add('current');
   }
   
   // Calculate words (rough estimation)
   wordCount = typedText.trim().split(/\s+/).length;
   
   // Check if text is complete
   if (typedText === currentText) {
     textDisplay.classList.add('highlight-animation');
     setTimeout(() => {
       textDisplay.classList.remove('highlight-animation');
       generateText();
       typingArea.value = '';
     }, 500);
   }
   
   updateStats();
 }

 // Update statistics
 function updateStats() {
   if (!startTime) return;
   
   const currentTime = new Date().getTime();
   const elapsedTime = (currentTime - startTime) / 1000 / 60; // in minutes
   
   const wpm = elapsedTime > 0 ? Math.round(wordCount / elapsedTime) : 0;
   const cpm = elapsedTime > 0 ? Math.round(charCount / elapsedTime) : 0;
   const accuracy = charCount > 0 ? Math.round((correctChars / charCount) * 100) : 0;
   
   wpmElement.textContent = wpm;
   cpmElement.textContent = cpm;
   accuracyElement.textContent = `${accuracy}%`;
 }

 // Close modal
 function closeModal() {
   resultModal.classList.remove('show');
   resetGame();
 }

 // Add keyboard shortcuts
 document.addEventListener('keydown', (e) => {
   // Ctrl+Enter to start/reset
   if (e.ctrlKey && e.key === 'Enter') {
     if (!isTyping) {
       startGame();
     } else {
       resetGame();
     }
     e.preventDefault();
   }
 });