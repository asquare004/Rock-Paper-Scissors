actor {
  // Stable variables to store player and high score
  stable var player : Text = "You";
  stable var highScore : Nat = 0;

  // Function to update player's high score
  public func updateHighScore(name : Text, score : Nat) : async () {
    if (score > highScore) {
      player := name;
      highScore := score;
    };
  };

  // Function to get global high score
  public query func getHighScore() : async (Nat, Text) {
    let res = (highScore, player);
    return res;
  };
};
