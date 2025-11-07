package com.example.venndiagramapi;

import java.util.*;
import java.util.stream.Collectors;

/**
 * VennDiagramModel<T> provides the logical structure for an N-set Venn diagram.
 * (Class-level Javadoc is unchanged)
 * @param <T> The generic type of the elements stored in the sets.
 */
public class VennDiagramModel<T> {

    // (Fields are unchanged)
    // We must change this to LinkedHashMap to preserve order for renaming
    private Map<String, Set<T>> inputSets;
    private final Map<Integer, Set<T>> partitions;
    private Set<T> universalSet;

    /**
     * Initializes the Venn Diagram model.
     * (Method is unchanged)
     */
    public VennDiagramModel() {
        this.inputSets = new LinkedHashMap<>(); // Use LinkedHashMap to preserve insertion order
        this.partitions = new HashMap<>();
        this.universalSet = new HashSet<>();
    }

    // --- Getters ---

    public List<String> getSetNames() {
        return new ArrayList<>(inputSets.keySet());
    }

    public Map<String, Set<T>> getInputSets() {
        return Collections.unmodifiableMap(inputSets);
    }

    public Set<T> getUniversalSet() {
        return Collections.unmodifiableSet(universalSet);
    }

    /**
     * NEW: Gets all elements in a specific set.
     * @param setName The name of the set.
     * @return A Set of elements.
     */
    public Set<T> getElementsInSet(String setName) {
        if (!inputSets.containsKey(setName)) {
            throw new IllegalArgumentException("No set found with name: " + setName);
        }
        return Collections.unmodifiableSet(inputSets.get(setName));
    }

    /**
     * Sets the Universal Set (all possible elements).
     * (Method is unchanged)
     */
    public void setUniversalSet(Set<T> universalSet) {
        this.universalSet = Objects.requireNonNull(universalSet, "Universal Set cannot be null");
        calculatePartitions();
    }

    /**
     * Adds a new set to the diagram model.
     * (Method is unchanged)
     */
    public void addSet(String setName, Set<T> set) {
        Objects.requireNonNull(setName, "Set name cannot be null");
        Objects.requireNonNull(set, "Set cannot be null");
        if (inputSets.containsKey(setName)) throw new IllegalArgumentException("Set name already exists: " + setName);
        inputSets.put(setName, set);
        this.universalSet.addAll(set);
        calculatePartitions();
    }

    /**
     * Removes a set completely from the diagram.
     * (Method is unchanged)
     */
    public void removeSet(String setName) {
        if (!inputSets.containsKey(setName)) {
            throw new IllegalArgumentException("No set found with name: " + setName);
        }
        inputSets.remove(setName);
        calculatePartitions();
    }

    /**
     * NEW: Renames a set.
     * This is tricky in a LinkedHashMap, so we rebuild it to preserve order.
     * @param oldName The current name of the set.
     * @param newName The new name for the set.
     */
    public void renameSet(String oldName, String newName) {
        if (oldName.equals(newName)) return; // No change
        if (!inputSets.containsKey(oldName)) {
            throw new IllegalArgumentException("Set to rename not found: " + oldName);
        }
        if (inputSets.containsKey(newName)) {
            throw new IllegalArgumentException("New set name already exists: " + newName);
        }

        Map<String, Set<T>> newMap = new LinkedHashMap<>();
        for (Map.Entry<String, Set<T>> entry : inputSets.entrySet()) {
            if (entry.getKey().equals(oldName)) {
                newMap.put(newName, entry.getValue());
            } else {
                newMap.put(entry.getKey(), entry.getValue());
            }
        }
        this.inputSets = newMap;
        calculatePartitions(); // Recalculate with new set name (affects formatter)
    }

    /**
     * The core logic: calculates which elements belong to which of the 2^N partitions.
     * (Method is unchanged)
     */
    private void calculatePartitions() {
        partitions.clear();
        Set<T> allElementsToProcess = new HashSet<>(this.universalSet);
        for (Set<T> set : inputSets.values()) allElementsToProcess.addAll(set);
        List<String> setNames = new ArrayList<>(inputSets.keySet());
        for (T element : allElementsToProcess) {
            int mask = 0;
            int bitValue = 1;
            for (String setName : setNames) {
                Set<T> currentSet = inputSets.get(setName);
                if (currentSet.contains(element)) {
                    mask |= bitValue;
                }
                bitValue <<= 1;
            }
            partitions
                    .computeIfAbsent(mask, k -> new HashSet<>())
                    .add(element);
        }
    }

    /**
     * Retrieves the set of elements that belong to a specific region (partition).
     * (Method is unchanged)
     */
    public Set<T> getPartition(int mask) {
        return partitions.getOrDefault(mask, Collections.emptySet());
    }

    // --- High-Level Set Operation Methods (Unchanged) ---
    // (getFullIntersection, getIntersection, getUnion, getDifference, getComplement)
    // ... all unchanged ...
    public Set<T> getFullIntersection() {
        int numSets = inputSets.size();
        if (numSets == 0) return Collections.emptySet();
        int fullMask = (1 << numSets) - 1;
        return getPartition(fullMask);
    }
    private int getSetIndex(String setName, List<String> setNames) {
        int index = setNames.indexOf(setName);
        if (index == -1) throw new IllegalArgumentException("No set found with name: " + setName);
        return index;
    }
    private int createMaskFromNames(String... setNames) {
        List<String> orderedSetNames = new ArrayList<>(inputSets.keySet());
        int mask = 0;
        for (String name : setNames) {
            int index = getSetIndex(name, orderedSetNames);
            mask |= (1 << index);
        }
        return mask;
    }
    public Set<T> getIntersection(String... setNames) {
        if (setNames.length == 0) return Collections.emptySet();
        int targetMask = createMaskFromNames(setNames);
        Set<T> result = new HashSet<>();
        for (Map.Entry<Integer, Set<T>> entry : partitions.entrySet()) {
            if ((entry.getKey() & targetMask) == targetMask) result.addAll(entry.getValue());
        }
        return result;
    }
    public Set<T> getUnion(String... setNames) {
        if (setNames.length == 0) return Collections.emptySet();
        int targetMask = createMaskFromNames(setNames);
        Set<T> result = new HashSet<>();
        for (Map.Entry<Integer, Set<T>> entry : partitions.entrySet()) {
            if ((entry.getKey() & targetMask) != 0) result.addAll(entry.getValue());
        }
        return result;
    }
    public Set<T> getDifference(String setA, String setB) {
        int maskA = createMaskFromNames(setA);
        int maskB = createMaskFromNames(setB);
        Set<T> result = new HashSet<>();
        for (Map.Entry<Integer, Set<T>> entry : partitions.entrySet()) {
            int partitionMask = entry.getKey();
            if ((partitionMask & maskA) != 0 && (partitionMask & maskB) == 0) result.addAll(entry.getValue());
        }
        return result;
    }
    public Set<T> getComplement(String setName) {
        int maskA = createMaskFromNames(setName);
        Set<T> result = new HashSet<>();
        for (Map.Entry<Integer, Set<T>> entry : partitions.entrySet()) {
            int partitionMask = entry.getKey();
            if ((partitionMask & maskA) == 0) result.addAll(entry.getValue());
        }
        return result;
    }

    // --- Element Management Methods (Unchanged) ---

    public Set<String> getSetsForElement(T element) {
        // ... (unchanged) ...
        Set<String> memberSets = new HashSet<>();
        for (Map.Entry<String, Set<T>> entry : inputSets.entrySet()) {
            if (entry.getValue().contains(element)) {
                memberSets.add(entry.getKey());
            }
        }
        return memberSets;
    }

    public void removeElement(T element) {
        // ... (unchanged) ...
        universalSet.remove(element);
        for (Set<T> set : inputSets.values()) {
            set.remove(element);
        }
        calculatePartitions();
    }

    public void renameElement(T oldName, T newName) {
        // ... (unchanged) ...
        if (oldName.equals(newName)) return;
        if (universalSet.contains(newName)) {
            throw new IllegalArgumentException("New element name '" + newName + "' already exists.");
        }
        Set<String> memberSets = getSetsForElement(oldName);
        removeElement(oldName);
        updateElementMembership(newName, memberSets);
    }

    public void updateElementMembership(T element, Set<String> setNamesToJoin) {
        // ... (unchanged) ...
        universalSet.add(element);
        for (String setName : inputSets.keySet()) {
            Set<T> currentSet = inputSets.get(setName);
            if (setNamesToJoin.contains(setName)) {
                currentSet.add(element);
            } else {
                currentSet.remove(element);
            }
        }
        calculatePartitions();
    }

    /**
     * NEW: Replaces the entire contents of a set with a new list of elements.
     * @param setName The set to update.
     * @param elements The new list of elements for the set.
     */
    public void setElementMembershipForSet(String setName, Set<T> elements) {
        if (!inputSets.containsKey(setName)) {
            throw new IllegalArgumentException("No set found with name: " + setName);
        }
        // Get the new set and add all its elements to the universal set
        Set<T> newElements = new HashSet<>(elements);
        universalSet.addAll(newElements);

        // Replace the old set with the new one
        inputSets.put(setName, newElements);

        // We must also update other sets in case an element was *removed*
        // from this set but still exists in another (it should remain in UniversalSet).
        // A full recalculation is the safest way.
        calculatePartitions();
    }
}