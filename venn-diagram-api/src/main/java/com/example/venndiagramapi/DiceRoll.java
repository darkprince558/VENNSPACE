package com.example.venndiagramapi;

import java.util.Objects;

/**
 * Represents a single roll of two dice.
 * Used for the "Two Dice Rolls" probability template.
 */
public class DiceRoll {
    private final java.util.List<Integer> dice;

    public DiceRoll(java.util.List<Integer> dice) {
        this.dice = new java.util.ArrayList<>(dice);
    }

    public DiceRoll(int... diceValues) {
        this.dice = new java.util.ArrayList<>();
        for (int v : diceValues) {
            this.dice.add(v);
        }
    }

    public java.util.List<Integer> getDice() {
        return java.util.Collections.unmodifiableList(dice);
    }

    // Backward compatibility helpers (optional, but might break if used elsewhere)
    // Better to update usages.

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        DiceRoll diceRoll = (DiceRoll) o;
        return java.util.Objects.equals(dice, diceRoll.dice);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(dice);
    }

    @Override
    public String toString() {
        // Output JSON format for easier parsing in frontend
        // {"dice": [1, 2, 3]}
        StringBuilder sb = new StringBuilder();
        sb.append("{\"dice\": [");
        for (int i = 0; i < dice.size(); i++) {
            sb.append(dice.get(i));
            if (i < dice.size() - 1)
                sb.append(", ");
        }
        sb.append("]}");
        return sb.toString();
    }
}
