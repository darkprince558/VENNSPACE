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
        switch (templateName) {
            case "DECK_OF_CARDS":
                return createDeckOfCards(diagramId);
            case "TWO_DICE_ROLLS":
                return createTwoDiceRolls(diagramId);
            default:
                throw new IllegalArgumentException("Unknown template name: " + templateName);
        }
    }

    private static DiagramWorkspace createDeckOfCards(String diagramId) {
        // All cards are Strings
        DiagramWorkspace workspace = new DiagramWorkspace(diagramId, "52-Card Deck", "STRING");
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
                String card = rank + suit;
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

    private static DiagramWorkspace createTwoDiceRolls(String diagramId) {
        // Use the new DICE_ROLL type
        DiagramWorkspace workspace = new DiagramWorkspace(diagramId, "Two 6-Sided Dice", "DICE_ROLL");
        VennDiagramModel<Object> model = workspace.getModel();

        Set<Object> universalSet = new HashSet<>();
        Set<Object> sumIs7 = new HashSet<>();
        Set<Object> doubles = new HashSet<>();
        Set<Object> firstRollIsEven = new HashSet<>();
        Set<Object> sumGreaterThan8 = new HashSet<>();

        for (int i = 1; i <= 6; i++) {
            for (int j = 1; j <= 6; j++) {
                // Create DiceRoll object instead of String
                DiceRoll roll = new DiceRoll(i, j);
                universalSet.add(roll);

                if (i + j == 7)
                    sumIs7.add(roll);
                if (i == j)
                    doubles.add(roll);
                if (i % 2 == 0)
                    firstRollIsEven.add(roll);
                if (i + j > 8)
                    sumGreaterThan8.add(roll);
            }
        }

        model.setUniversalSet(universalSet);
        model.addSet("Sum is 7", sumIs7);
        model.addSet("Doubles", doubles);
        model.addSet("First Roll is Even", firstRollIsEven);
        model.addSet("Sum > 8", sumGreaterThan8);

        return workspace;
    }
}