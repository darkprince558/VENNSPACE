package com.example.venndiagramapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

/**
 * API Controller (Front Door) - Rewritten for Multi-Workspace support.
 *
 * All endpoints are now in one of two categories:
 * 1. Dashboard: /api/diagrams/... (managing workspaces)
 * 2. Editor: /api/diagrams/{diagramId}/... (editing a specific workspace)
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class VennDiagramController {

    @Autowired
    private DiagramManagerService manager;

    // --- 1. Dashboard Endpoints ---

    /**
     * Gets a list of all available diagram workspaces.
     */
    @GetMapping("/diagrams")
    public List<DiagramWorkspace.Summary> getAllWorkspaces() {
        return manager.getAllWorkspaces();
    }

    /**
     * Creates a new, blank diagram workspace.
     */
    @PostMapping("/diagrams/blank")
    public DiagramWorkspace.Summary createBlankWorkspace(@RequestParam String name,
                                                         @RequestParam String elementType) {
        return manager.createBlankWorkspace(name, elementType).getSummary();
    }

    /**
     * Creates a new diagram workspace from a probability template.
     */
    @PostMapping("/diagrams/template")
    public DiagramWorkspace.Summary createTemplateWorkspace(@RequestParam String templateName) {
        return manager.createTemplateWorkspace(templateName).getSummary();
    }

    // --- 2. Editor Endpoints (all require a diagramId) ---

    /**
     * Gets the metadata (name, type) for a single diagram.
     */
    @GetMapping("/diagrams/{diagramId}/metadata")
    public DiagramWorkspace.Summary getWorkspaceMetadata(@PathVariable String diagramId) {
        return manager.getWorkspace(diagramId).getSummary();
    }

    /**
     * Gets all set names for a specific diagram.
     */
    @GetMapping("/diagrams/{diagramId}/sets")
    public List<String> getSetNames(@PathVariable String diagramId) {
        return manager.getSetNames(diagramId);
    }

    /**
     * Gets all elements in the universal set for a specific diagram.
     */
    @GetMapping("/diagrams/{diagramId}/elements")
    public Set<Object> getAllElements(@PathVariable String diagramId) {
        return manager.getAllElements(diagramId);
    }

    /**
     * Gets the list of set names an element belongs to.
     */
    @GetMapping("/diagrams/{diagramId}/element/{elementValue}")
    public Set<String> getSetsForElement(@PathVariable String diagramId,
                                         @PathVariable String elementValue) {
        return manager.getSetsForElement(diagramId, elementValue);
    }

    /**
     * Gets all elements in a specific set.
     */
    @GetMapping("/diagrams/{diagramId}/set/{setName}/elements")
    public Set<Object> getElementsInSet(@PathVariable String diagramId,
                                        @PathVariable String setName) {
        return manager.getElementsInSet(diagramId, setName);
    }

    /**
     * Gets the formatted partition table for a diagram.
     */
    @GetMapping("/diagrams/{diagramId}/partitions")
    public String getPartitions(@PathVariable String diagramId) {
        return manager.getPartitions(diagramId);
    }

    // --- Set Operations (now with diagramId) ---

    @GetMapping("/diagrams/{diagramId}/union")
    public Set<Object> getUnion(@PathVariable String diagramId, @RequestParam String setA, @RequestParam String setB) {
        return manager.getUnion(diagramId, setA, setB);
    }
    @GetMapping("/diagrams/{diagramId}/intersection")
    public Set<Object> getIntersection(@PathVariable String diagramId, @RequestParam String setA, @RequestParam String setB) {
        return manager.getIntersection(diagramId, setA, setB);
    }
    @GetMapping("/diagrams/{diagramId}/difference")
    public Set<Object> getDifference(@PathVariable String diagramId, @RequestParam String setA, @RequestParam String setB) {
        return manager.getDifference(diagramId, setA, setB);
    }
    @GetMapping("/diagrams/{diagramId}/complement")
    public Set<Object> getComplement(@PathVariable String diagramId, @RequestParam String set) {
        return manager.getComplement(diagramId, set);
    }

    // --- POST Endpoints (now with diagramId) ---

    @PostMapping("/diagrams/{diagramId}/sets")
    public void addSet(@PathVariable String diagramId, @RequestParam String name) {
        manager.addSet(diagramId, name);
    }

    @PostMapping("/diagrams/{diagramId}/sets/delete")
    public void removeSet(@PathVariable String diagramId, @RequestParam String name) {
        manager.removeSet(diagramId, name);
    }

    @PostMapping("/diagrams/{diagramId}/sets/rename")
    public void renameSet(@PathVariable String diagramId, @RequestParam String oldName, @RequestParam String newName) {
        manager.renameSet(diagramId, oldName, newName);
    }

    @PostMapping("/diagrams/{diagramId}/set/membership")
    public void setElementMembershipForSet(@PathVariable String diagramId,
                                           @RequestParam String name,
                                           @RequestParam(required = false) Set<String> elements) {
        manager.setElementMembershipForSet(diagramId, name, elements);
    }

    @PostMapping("/diagrams/{diagramId}/element")
    public void updateElementMembership(@PathVariable String diagramId,
                                        @RequestParam String name,
                                        @RequestParam(required = false) Set<String> sets) {
        manager.updateElementMembership(diagramId, name, sets);
    }

    @PostMapping("/diagrams/{diagramId}/element/delete")
    public void deleteElement(@PathVariable String diagramId, @RequestParam String name) {
        manager.deleteElement(diagramId, name);
    }

    @PostMapping("/diagrams/{diagramId}/element/rename")
    public void renameElement(@PathVariable String diagramId, @RequestParam String oldName, @RequestParam String newName) {
        manager.renameElement(diagramId, oldName, newName);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
}