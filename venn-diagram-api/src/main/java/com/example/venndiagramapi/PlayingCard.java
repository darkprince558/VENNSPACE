package com.example.venndiagramapi;

import java.util.Objects;

public class PlayingCard {
    private String rank; // 2-10, J, Q, K, A
    private String suit; // H, D, C, S

    public PlayingCard() {
    }

    public PlayingCard(String rank, String suit) {
        this.rank = rank;
        this.suit = suit;
    }

    public String getRank() {
        return rank;
    }

    public void setRank(String rank) {
        this.rank = rank;
    }

    public String getSuit() {
        return suit;
    }

    public void setSuit(String suit) {
        this.suit = suit;
    }

    // Helper to determine color
    public String getColor() {
        if ("H".equals(suit) || "D".equals(suit)) {
            return "RED";
        }
        return "BLACK";
    }

    public boolean isFaceCard() {
        return "J".equals(rank) || "Q".equals(rank) || "K".equals(rank);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        PlayingCard that = (PlayingCard) o;
        return Objects.equals(rank, that.rank) && Objects.equals(suit, that.suit);
    }

    @Override
    public int hashCode() {
        return Objects.hash(rank, suit);
    }

    @Override
    public String toString() {
        return rank + suit;
    }
}
