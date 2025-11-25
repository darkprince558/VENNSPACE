package com.example.venndiagramapi;

import java.util.Objects;

/**
 * Represents a single roll of two dice.
 * Used for the "Two Dice Rolls" probability template.
 */
public class DiceRoll {
    private final int die1;
    private final int die2;

    public DiceRoll(int die1, int die2) {
        this.die1 = die1;
        this.die2 = die2;
    }

    public int getDie1() {
        return die1;
    }

    public int getDie2() {
        return die2;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        DiceRoll diceRoll = (DiceRoll) o;
        return die1 == diceRoll.die1 && die2 == diceRoll.die2;
    }

    @Override
    public int hashCode() {
        return Objects.hash(die1, die2);
    }

    @Override
    public String toString() {
        return String.format("(%d,%d)", die1, die2);
    }
}
