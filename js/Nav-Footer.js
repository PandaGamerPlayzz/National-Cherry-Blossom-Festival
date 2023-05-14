const phrases = [
    "Enjoy the festival and let your imagination blossom!", 
    "Spring to life with flowers and blossom!", 
    "Let the blossoms put a spring in your step!", 
    "Pause the spring cleaning for a little bit and enjoy the Cherry Blossom Festival!"
];

console.log("E");
console.log(phrases[Math.floor(Math.random() * phrases.length)]);
document.getElementById("blossom-phrase").innerHTML = phrases[Math.floor(Math.random() * phrases.length)];