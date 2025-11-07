package com.example.venndiagramapi;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Service layer (Singleton) that holds the "brain" (the VennDiagramModel).
 * (Class-level Javadoc is unchanged)
 */
@Service
public class VennDiagramService {

    private VennDiagramModel<String> diagram;

    /**
     * This @PostConstruct method runs ONCE when the server starts.
     * (Method is unchanged)
     */
    @PostConstruct
    public void init() {
        this.diagram = new VennDiagramModel<>();
        // ... (Initial data loading is unchanged) ...
        Set<String> studentsInMath = new HashSet<>(Arrays.asList("Alice", "Bob", "Charlie", "Dave", "Eve"));
        Set<String> studentsInScience = new HashSet<>(Arrays.asList("Bob", "Charlie", "Frank", "Grace", "Eve"));
        Set<String> studentsInArt = new HashSet<>(Arrays.asList("Alice", "Frank", "Hannah", "Charlie"));
        Set<String> allStudents = new HashSet<>(Arrays.asList(
                "Alice", "Bob", "Charlie", "Dave", "Eve",
                "Frank", "Grace", "Hannah", "Ivan"
        ));
        diagram.setUniversalSet(allStudents);
        diagram.addSet("Math", studentsInMath);
        diagram.addSet("Science", studentsInScience);
        diagram.addSet("Art", studentsInArt);
    }

    // --- "Read" Methods ---

    public List<String> getSetNames() {
        return diagram.getSetNames();
    }

    public Set<String> getAllElements() {
        return diagram.getUniversalSet();
    }

    public Set<String> getSetsForElement(String name) {
        return diagram.getSetsForElement(name);
    }

    /**
     * NEW: Gets all elements in a specific set.
     * @param name The set name.
     * @return A Set of element names.
     */
    public Set<String> getElementsInSet(String name) {
        return diagram.getElementsInSet(name);
    }

    public String getPartitions() {
        VennDiagramFormatter<String> formatter = new VennDiagramFormatter<>(diagram);
        return formatter.getPartitionsAsString();
    }

    // (getUnion, getIntersection, getDifference, getComplement are unchanged)
    // ...
    public Set<String> getUnion(String setA, String setB) {
        return diagram.getUnion(setA, setB);
    }
    public Set<String> getIntersection(String setA, String setB) {
        return diagram.getIntersection(setA, setB);
    }
    public Set<String> getDifference(String setA, String setB) {
        return diagram.getDifference(setA, setB);
    }
    public Set<String> getComplement(String set) {
        return diagram.getComplement(set);
    }

    // --- "Write" Methods ---

    public synchronized void addSet(String name) {
        diagram.addSet(name, new HashSet<>());
    }

    public synchronized void removeSet(String name) {
        diagram.removeSet(name);
    }

    /**
     * NEW: Renames a set.
     * @param oldName The current name.
     * @param newName The new name.
     */
    public synchronized void renameSet(String oldName, String newName) {
        diagram.renameSet(oldName, newName);
    }

    public synchronized void updateElementMembership(String elementName, Set<String> setNames) {
        Set<String> setsToJoin = (setNames != null) ? setNames : new HashSet<>();
        diagram.updateElementMembership(elementName, setsToJoin);
    }

    /**
     * NEW: Updates the entire membership of a single set.
     * @param setName The set to update.
     * @param elementNames The new list of elements for the set.
     */
    public synchronized void setElementMembershipForSet(String setName, Set<String> elementNames) {
        Set<String> elements = (elementNames != null) ? elementNames : new HashSet<>();
        diagram.setElementMembershipForSet(setName, elements);
    }

    public synchronized void deleteElement(String name) {
        diagram.removeElement(name);
    }

    public synchronized void renameElement(String oldName, String newName) {
        diagram.renameElement(oldName, newName);
    }
}