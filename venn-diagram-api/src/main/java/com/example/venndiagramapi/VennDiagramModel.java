package com.example.venndiagramapi;

import java.util.*;
import java.util.stream.Collectors;

/**
 * VennDiagramModel<Object> provides the logical structure for an N-set Venn diagram.
 * It is now generic on <Object> to support multiple data types (String, Double, etc.)
 */
public class VennDiagramModel<T> { // We keep <T> for internal consistency, but it will be <Object>

    private Map<String, Set<T>> inputSets;
    private final Map<Integer, Set<T>> partitions;
    private Set<T> universalSet;

    public VennDiagramModel() {
        this.inputSets = new LinkedHashMap<>();
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
    public Set<T> getElementsInSet(String setName) {
        if (!inputSets.containsKey(setName)) {
            throw new IllegalArgumentException("No set found with name: " + setName);
        }
        return Collections.unmodifiableSet(inputSets.get(setName));
    }

    // --- Set Management ---
    public void setUniversalSet(Set<T> universalSet) {
        this.universalSet = Objects.requireNonNull(universalSet, "Universal Set cannot be null");
        calculatePartitions();
    }
    public void addSet(String setName, Set<T> set) {
        Objects.requireNonNull(setName, "Set name cannot be null");
        Objects.requireNonNull(set, "Set cannot be null");
        if (inputSets.containsKey(setName)) throw new IllegalArgumentException("Set name already exists: " + setName);
        inputSets.put(setName, set);
        this.universalSet.addAll(set);
        calculatePartitions();
    }
    public void removeSet(String setName) {
        if (!inputSets.containsKey(setName)) {
            throw new IllegalArgumentException("No set found with name: " + setName);
        }
        inputSets.remove(setName);
        calculatePartitions();
    }
    public void renameSet(String oldName, String newName) {
        if (oldName.equals(newName)) return;
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
        calculatePartitions();
    }

    // --- Core Logic ---
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
                // Must use Objects.equals for generic types
                if (currentSet.contains(element)) {
                    mask |= bitValue;
                }
                bitValue <<= 1;
            }
            partitions.computeIfAbsent(mask, k -> new HashSet<>()).add(element);
        }
    }
    public Set<T> getPartition(int mask) {
        return partitions.getOrDefault(mask, Collections.emptySet());
    }

    // --- High-Level Set Operations ---
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

    // --- Element Management Methods ---
    public Set<String> getSetsForElement(T element) {
        Set<String> memberSets = new HashSet<>();
        for (Map.Entry<String, Set<T>> entry : inputSets.entrySet()) {
            if (entry.getValue().contains(element)) {
                memberSets.add(entry.getKey());
            }
        }
        return memberSets;
    }
    public void removeElement(T element) {
        universalSet.remove(element);
        for (Set<T> set : inputSets.values()) {
            set.remove(element);
        }
        calculatePartitions();
    }
    public void renameElement(T oldName, T newName) {
        // Use Objects.equals for generic object comparison
        if (Objects.equals(oldName, newName)) return;
        if (universalSet.contains(newName)) {
            throw new IllegalArgumentException("New element name '" + newName + "' already exists.");
        }
        Set<String> memberSets = getSetsForElement(oldName);
        removeElement(oldName);
        updateElementMembership(newName, memberSets);
    }
    public void updateElementMembership(T element, Set<String> setNamesToJoin) {
        universalSet.add(element); // Add to universal set
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
    public void setElementMembershipForSet(String setName, Set<T> elements) {
        if (!inputSets.containsKey(setName)) {
            throw new IllegalArgumentException("No set found with name: " + setName);
        }
        Set<T> newElements = new HashSet<>(elements);
        universalSet.addAll(newElements);
        inputSets.put(setName, newElements);
        calculatePartitions();
    }
}