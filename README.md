# code-quiz

A multiple-choice quiz on html, css and javascript.

User is shown a short greeting message, and they can see a 'high scores' button along with a 'start game' button, and a timer set to 60. If, at any point during the game, the high scores button is pressed, the game terminates and the the player is shown a high scores leader board that is loaded from local memory.

When 'start game' button is pressed, player is shown a randomly chosen question from a possible 15, along with 4 answer buttons. only one answer will show the message 'correct' and increment player score variable. all others will print 'incorrect'.

Whether answer is correct or incorrect, player is then shown another randomly chosen question from remaining 14. This process repeats, keeping track of player score until time runs out or until all questions are answered.

Then player is shown their high score and is prompted to input name. Name and high score are show along with previous names and high scores on locally stored leaderboard.

Image of deployed site viewable at './Assets/Images/code-quiz-deployed.png'

Deployed site: https://aphexgil.github.io/code-quiz/