package com.example.venndiagramapi;

import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * Replaces VennDiagramService.
 * This is the new Singleton "brain" that manages all active DiagramWorkspaces.
 * It holds a map of all diagrams in memory.
 */
@Service
public class DiagramManagerService {

    // Our in-memory "database" of all diagrams, keyed by their unique ID
    private final Map<String, DiagramWorkspace> workspaces = new ConcurrentHashMap<>();

    /**
     * Helper to find a workspace or throw a user-friendly error.
     * This is the "gatekeeper" for all diagram-specific API calls.
     */
    public DiagramWorkspace getWorkspace(String diagramId) {
        DiagramWorkspace workspace = workspaces.get(diagramId);
        if (workspace == null) {
            throw new IllegalArgumentException("No diagram workspace found with ID: " + diagramId);
        }
        return workspace;
    }

    /**
     * Helper to get the core model from a workspace.
     */
    public VennDiagramModel<Object> getVennModel(String diagramId) {
        return getWorkspace(diagramId).getModel();
    }

    /**
     * Parses a String element from the web into the correct Java type
     * for this workspace (e.g., "5.0" -> 5.0).
     */
    public Object parseElement(String diagramId, String elementValue) {
        String elementType = getWorkspace(diagramId).getElementType();

        try {
            switch (elementType) {
                case "NUMBER":
                    // Try to parse as a Double for numerical data
                    return Double.parseDouble(elementValue);
                case "DICE_ROLL":
                    // Parse "(d1,d2)" string back to DiceRoll object
                    if (elementValue.startsWith("(") && elementValue.endsWith(")")) {
                        String[] parts = elementValue.substring(1, elementValue.length() - 1).split(",");
                        if (parts.length == 2) {
                            int d1 = Integer.parseInt(parts[0].trim());
                            int d2 = Integer.parseInt(parts[1].trim());
                            return new DiceRoll(d1, d2);
                        }
                    }
                    // Fallback if parsing fails (shouldn't happen if frontend is good)
                    return elementValue;
                case "STRING":
                case "IMAGE_URL":
                default:
                    // Just return the string
                    return elementValue;
            }
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException(
                    "Element '" + elementValue + "' is not a valid format for this diagram.");
        }
    }

    // --- Dashboard Methods ---

    /**
     * Returns a list of all created diagrams for the dashboard.
     */
    public List<DiagramWorkspace.Summary> getAllWorkspaces() {
        return workspaces.values().stream()
                .map(DiagramWorkspace::getSummary)
                .collect(Collectors.toList());
    }

    /**
     * Creates a new, blank diagram and adds it to the manager.
     * 
     * @return The newly created workspace.
     */
    public synchronized DiagramWorkspace createBlankWorkspace(String name, String elementType) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Diagram name cannot be empty.");
        }
        if (!Arrays.asList("STRING", "NUMBER", "IMAGE_URL").contains(elementType)) {
            throw new IllegalArgumentException("Invalid element type.");
        }

        String diagramId = UUID.randomUUID().toString();
        DiagramWorkspace workspace = new DiagramWorkspace(diagramId, name, elementType);
        workspaces.put(diagramId, workspace);
        return workspace;
    }

    /**
     * Creates a new diagram from a probability template.
     * 
     * @return The newly created workspace.
     */
    public synchronized DiagramWorkspace createTemplateWorkspace(String templateName) {
        String diagramId = UUID.randomUUID().toString();
        DiagramWorkspace workspace = ProbabilityTemplateFactory.createFromTemplate(diagramId, templateName);
        workspaces.put(diagramId, workspace);
        return workspace;
    }

    // --- Editor "Read" Methods (all now require diagramId) ---

    public List<String> getSetNames(String diagramId) {
        return getVennModel(diagramId).getSetNames();
    }

    public List<SetDTO> getSetsInfo(String diagramId) {
        VennDiagramModel<Object> model = getVennModel(diagramId);
        List<String> names = model.getSetNames();
        return names.stream()
                .map(name -> new SetDTO(name, model.getElementsInSet(name).size()))
                .collect(Collectors.toList());
    }

    public Set<Object> getAllElements(String diagramId) {
        return getVennModel(diagramId).getUniversalSet();
    }

    public Set<String> getSetsForElement(String diagramId, String elementValue) {
        Object element = parseElement(diagramId, elementValue);
        return getVennModel(diagramId).getSetsForElement(element);
    }

    public Set<Object> getElementsInSet(String diagramId, String name) {
        return getVennModel(diagramId).getElementsInSet(name);
    }

    public String getPartitions(String diagramId) {
        // Formatter is created on-the-fly, so it's always up-to-date
        VennDiagramFormatter<Object> formatter = new VennDiagramFormatter<>(getVennModel(diagramId));
        return formatter.getPartitionsAsString();
    }

    public Set<Object> getUnion(String diagramId, String setA, String setB) {
        return getVennModel(diagramId).getUnion(setA, setB);
    }

    public Set<Object> getIntersection(String diagramId, String setA, String setB) {
        return getVennModel(diagramId).getIntersection(setA, setB);
    }

    public Set<Object> getDifference(String diagramId, String setA, String setB) {
        return getVennModel(diagramId).getDifference(setA, setB);
    }

    public Set<Object> getComplement(String diagramId, String set) {
        return getVennModel(diagramId).getComplement(set);
    }

    // --- Editor "Write" Methods (all now require diagramId) ---

    public synchronized void addSet(String diagramId, String name) {
        getVennModel(diagramId).addSet(name, new HashSet<>());
    }

    public synchronized void removeSet(String diagramId, String name) {
        getVennModel(diagramId).removeSet(name);
    }

    public synchronized void renameSet(String diagramId, String oldName, String newName) {
        getVennModel(diagramId).renameSet(oldName, newName);
    }

    public synchronized void updateElementMembership(String diagramId, String elementValue, Set<String> setNames) {
        Object element = parseElement(diagramId, elementValue);
        Set<String> setsToJoin = (setNames != null) ? setNames : new HashSet<>();
        getVennModel(diagramId).updateElementMembership(element, setsToJoin);
    }

    public synchronized void setElementMembershipForSet(String diagramId, String setName, Set<String> elementValues) {
        Set<String> elementsStr = (elementValues != null) ? elementValues : new HashSet<>();
        // Must parse every element in the set
        Set<Object> elements = elementsStr.stream()
                .map(val -> parseElement(diagramId, val))
                .collect(Collectors.toSet());

        getVennModel(diagramId).setElementMembershipForSet(setName, elements);
    }

    public synchronized void deleteElement(String diagramId, String elementValue) {
        Object element = parseElement(diagramId, elementValue);
        getVennModel(diagramId).removeElement(element);
    }

    public synchronized void renameElement(String diagramId, String oldElementValue, String newElementValue) {
        Object oldElement = parseElement(diagramId, oldElementValue);
        Object newElement = parseElement(diagramId, newElementValue);
        getVennModel(diagramId).renameElement(oldElement, newElement);
    }
}