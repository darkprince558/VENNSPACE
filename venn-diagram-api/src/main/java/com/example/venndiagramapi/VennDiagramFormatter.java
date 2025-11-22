package com.example.venndiagramapi;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Formats a VennDiagramModel<Object> into a readable string.
 * This class is now stateless and created on-the-fly.
 */
public class VennDiagramFormatter<T> { // Still generic, will be <Object>

    private final VennDiagramModel<T> model;

    public VennDiagramFormatter(VennDiagramModel<T> model) {
        this.model = model;
    }

    public String getPartitionsAsString() {
        StringBuilder sb = new StringBuilder();
        List<String> setNames = model.getSetNames();
        int numSets = setNames.size();
        int totalPartitions = 1 << numSets;

        sb.append("--- Venn Diagram Partitions (N=").append(numSets).append(") ---");
        sb.append("\nSet Order: ").append(setNames);
        sb.append("\nTotal unique regions: ").append(totalPartitions).append("\n");

        for (int mask = 0; mask < totalPartitions; mask++) {
            Set<T> elements = model.getPartition(mask);
            if (!elements.isEmpty()) {
                String regionDescription = formatMask(mask, setNames);
                // Convert elements to string for printing
                String elementsStr = elements.stream()
                        .map(Object::toString)
                        .collect(Collectors.joining(", "));
                sb.append(String.format("Region %d (%s): [%s]\n", mask, regionDescription, elementsStr));
            }
        }
        sb.append("-------------------------------------------------");
        return sb.toString();
    }

    private String formatMask(int mask, List<String> setNames) {
        if (mask == 0) return "Outside all sets (Universal Set)";
        StringBuilder sb = new StringBuilder();
        sb.append("In (");
        StringBuilder notIn = new StringBuilder();
        for (int i = 0; i < setNames.size(); i++) {
            String name = setNames.get(i);
            if ((mask & (1 << i)) != 0) sb.append(name).append(", ");
            else notIn.append(name).append(", ");
        }
        String inStr = sb.substring(0, sb.length() - 2) + ")";
        String notInStr = (notIn.length() > 0) ? " ∖ Not in (" + notIn.substring(0, notIn.length() - 2) + ")" : "";
        return inStr + notInStr;
    }
}