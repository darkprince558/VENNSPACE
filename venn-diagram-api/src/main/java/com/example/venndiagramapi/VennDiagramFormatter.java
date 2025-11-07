package com.example.venndiagramapi;

import java.util.List;
import java.util.Set;

/**
 * VennDiagramFormatter is responsible for taking a VennDiagramModel
 * and converting its partition data into a human-readable string.
 * It is decoupled from the model's core logic.
 *
 * @param <T> The generic type of the elements in the model.
 */
public class VennDiagramFormatter<T> {

    private final VennDiagramModel<T> model;

    /**
     * Constructs a new formatter for a given model.
     * @param model The VennDiagramModel to format.
     */
    public VennDiagramFormatter(VennDiagramModel<T> model) {
        this.model = model;
    }

    /**
     * Generates a string summary of all calculated partitions.
     * @return A multi-line string describing the partitions.
     */
    public String getPartitionsAsString() {
        StringBuilder sb = new StringBuilder();
        List<String> setNames = model.getSetNames();

        // --- FIX 1 ---
        // Replace model.getNumSets() with model.getSetNames().size()
        int numSets = model.getSetNames().size();

        // --- FIX 2 ---
        // Replace model.getTotalPartitions() with the calculation
        int totalPartitions = 1 << numSets; // 2^N partitions

        sb.append("--- Venn Diagram Partitions (N=").append(numSets).append(") ---");
        sb.append("\nSet Order: ").append(setNames);
        sb.append("\nTotal unique regions: ").append(totalPartitions).append("\n");

        for (int mask = 0; mask < totalPartitions; mask++) {
            Set<T> elements = model.getPartition(mask);

            // Only print regions that are not empty
            if (!elements.isEmpty()) {
                String regionDescription = formatMask(mask, setNames);
                sb.append(String.format("Region %d (%s): %s\n", mask, regionDescription, elements));
            }
        }
        sb.append("-------------------------------------------------");
        return sb.toString();
    }

    /**
     * Prints the formatted partition summary to the console.
     */
    public void printPartitions() {
        System.out.println(getPartitionsAsString());
    }

    /**
     * Helper method to convert a bitmask into a human-readable description.
     * @param mask The integer bitmask.
     * @param setNames The ordered list of set names.
     * @return A string describing which sets the region belongs to.
     */
    private String formatMask(int mask, List<String> setNames) {
        if (mask == 0) return "Outside all sets (Universal Set)";

        StringBuilder sb = new StringBuilder();
        sb.append("In (");
        StringBuilder notIn = new StringBuilder();

        for (int i = 0; i < setNames.size(); i++) {
            String name = setNames.get(i);
            // Check if the i-th bit is set
            if ((mask & (1 << i)) != 0) {
                sb.append(name).append(", ");
            } else {
                notIn.append(name).append(", ");
            }
        }

        // Clean up and combine the strings
        String inStr = (sb.length() > 4) ? sb.substring(0, sb.length() - 2) + ")" : "none)";
        String notInStr = (notIn.length() > 0) ? " ∖ Not in (" + notIn.substring(0, notIn.length() - 2) + ")" : "";

        if(inStr.equals("none)") && notIn.length() == 0) {
            return "ERROR: Empty Set Names"; // Should not happen
        }

        if (inStr.equals("none)")) return notInStr.replaceFirst(" ∖ Not in", "Not in");

        return inStr + notInStr;
    }
}