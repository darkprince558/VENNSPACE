package com.example.venndiagramapi;

import java.util.HashSet;
import java.util.Set;

/**
 * A factory class to create pre-populated DiagramWorkspaces for
 * common probability problems (e.g., Cards, Dice).
 */
public class ProbabilityTemplateFactory {

    /**
     * Creates a new workspace based on a template name.
     */
    public static DiagramWorkspace createFromTemplate(String diagramId, String templateName) {
        if ("DECK_OF_CARDS".equals(templateName)) {
            return createDeckOfCards(diagramId);
        } else if (templateName.startsWith("DICE_ROLLS_")) {
            try {
                int numDice = Integer.parseInt(templateName.substring("DICE_ROLLS_".length()));
                return createDiceRolls(diagramId, numDice);
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Invalid dice count in template: " + templateName);
            }
        } else if ("TWO_DICE_ROLLS".equals(templateName)) {
            // Backward compatibility
            return createDiceRolls(diagramId, 2);
        } else {
            throw new IllegalArgumentException("Unknown template name: " + templateName);
        }
    }

    private static DiagramWorkspace createDeckOfCards(String diagramId) {
        // Use the new PLAYING_CARD type
        DiagramWorkspace workspace = new DiagramWorkspace(diagramId, "52-Card Deck", "PLAYING_CARD");
        VennDiagramModel<Object> model = workspace.getModel();

        String[] suits = { "H", "D", "C", "S" }; // Hearts, Diamonds, Clubs, Spades
        String[] ranks = { "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A" };

        Set<Object> universalSet = new HashSet<>();
        Set<Object> hearts = new HashSet<>();
        Set<Object> diamonds = new HashSet<>();
        Set<Object> clubs = new HashSet<>();
        Set<Object> spades = new HashSet<>();
        Set<Object> aces = new HashSet<>();
        Set<Object> faceCards = new HashSet<>();
        Set<Object> redCards = new HashSet<>();

        for (String suit : suits) {
            for (String rank : ranks) {
                PlayingCard card = new PlayingCard(rank, suit);
                universalSet.add(card);

                if (suit.equals("H"))
                    hearts.add(card);
                if (suit.equals("D"))
                    diamonds.add(card);
                if (suit.equals("C"))
                    clubs.add(card);
                if (suit.equals("S"))
                    spades.add(card);
                if (suit.equals("H") || suit.equals("D"))
                    redCards.add(card);
                if (rank.equals("A"))
                    aces.add(card);
                if (rank.equals("J") || rank.equals("Q") || rank.equals("K"))
                    faceCards.add(card);
            }
        }

        model.setUniversalSet(universalSet);
        model.addSet("Hearts", hearts);
        model.addSet("Diamonds", diamonds);
        model.addSet("Clubs", clubs);
        model.addSet("Spades", spades);
        model.addSet("Aces", aces);
        model.addSet("Face Cards", faceCards);
        model.addSet("Red Cards", redCards);

        return workspace;
    }

    private static DiagramWorkspace createDiceRolls(String diagramId, int numDice) {
        if (numDice < 1 || numDice > 5) {
            throw new IllegalArgumentException("Number of dice must be between 1 and 5");
        }

        DiagramWorkspace workspace = new DiagramWorkspace(diagramId, numDice + " Dice Rolls", "DICE_ROLL");
        VennDiagramModel<Object> model = workspace.getModel();

        Set<Object> universalSet = new HashSet<>();
        Set<Object> sumIs7 = new HashSet<>(); // Only relevant for >= 2 dice, but we can keep generic logic
        Set<Object> doubles = new HashSet<>(); // All same
        Set<Object> firstRollIsEven = new HashSet<>();
        Set<Object> sumGreaterThan8 = new HashSet<>();

        // Generate all combinations recursively
        generateDiceCombinations(new java.util.ArrayList<>(), numDice, universalSet, sumIs7, doubles, firstRollIsEven,
                sumGreaterThan8);

        model.setUniversalSet(universalSet);

        // Add sets based on what makes sense
        if (numDice >= 2) {
            model.addSet("Sum is 7", sumIs7);
            model.addSet("Doubles (All Same)", doubles);
            model.addSet("Sum > 8", sumGreaterThan8);
        }
        model.addSet("First Die Even", firstRollIsEven);

        return workspace;
    }

    private static void generateDiceCombinations(java.util.List<Integer> currentRoll, int targetDice,
            Set<Object> universalSet,
            Set<Object> sumIs7,
            Set<Object> doubles,
            Set<Object> firstRollIsEven,
            Set<Object> sumGreaterThan8) {
        if (currentRoll.size() == targetDice) {
            DiceRoll roll = new DiceRoll(currentRoll);
            universalSet.add(roll);

            int sum = currentRoll.stream().mapToInt(Integer::intValue).sum();
            boolean isAllSame = currentRoll.stream().distinct().count() == 1;
            boolean isFirstEven = currentRoll.get(0) % 2 == 0;

            if (sum == 7)
                sumIs7.add(roll);
            if (isAllSame)
                doubles.add(roll);
            if (isFirstEven)
                firstRollIsEven.add(roll);
            if (sum > 8)
                sumGreaterThan8.add(roll);
            return;
        }

        for (int i = 1; i <= 6; i++) {
            currentRoll.add(i);
            generateDiceCombinations(currentRoll, targetDice, universalSet, sumIs7, doubles, firstRollIsEven,
                    sumGreaterThan8);
            currentRoll.remove(currentRoll.size() - 1);
        }
    }
}