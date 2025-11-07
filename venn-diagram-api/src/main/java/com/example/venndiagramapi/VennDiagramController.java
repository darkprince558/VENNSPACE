package com.example.venndiagramapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

/**
 * The "Front Door" (API Controller) for the application.
 * (Class-level Javadoc is unchanged)
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class VennDiagramController {

    @Autowired
    private VennDiagramService service;

    // --- GET Endpoints ---

    @GetMapping("/hello")
    public String hello() { return "Hello from the Venn Diagram API!"; }

    @GetMapping("/sets")
    public List<String> getSetNames() { return service.getSetNames(); }

    @GetMapping("/elements")
    public Set<String> getAllElements() {
        return service.getAllElements();
    }

    @GetMapping("/element/{name}")
    public Set<String> getSetsForElement(@PathVariable String name) {
        return service.getSetsForElement(name);
    }

    /**
     * NEW: Gets all elements in a specific set.
     * @param name The name of the set, passed in the URL path.
     */
    @GetMapping("/set/{name}/elements")
    public Set<String> getElementsInSet(@PathVariable String name) {
        return service.getElementsInSet(name);
    }

    @GetMapping("/partitions")
    public String getPartitions() { return service.getPartitions(); }

    // (getUnion, intersection, difference, complement are unchanged)
    // ...
    @GetMapping("/union")
    public Set<String> getUnion(@RequestParam String setA, @RequestParam String setB) {
        return service.getUnion(setA, setB);
    }
    @GetMapping("/intersection")
    public Set<String> getIntersection(@RequestParam String setA, @RequestParam String setB) {
        return service.getIntersection(setA, setB);
    }
    @GetMapping("/difference")
    public Set<String> getDifference(@RequestParam String setA, @RequestParam String setB) {
        return service.getDifference(setA, setB);
    }
    @GetMapping("/complement")
    public Set<String> getComplement(@RequestParam String set) {
        return service.getComplement(set);
    }

    // --- POST Endpoints ---

    @PostMapping("/sets")
    public void addSet(@RequestParam String name) { service.addSet(name); }

    @PostMapping("/sets/delete")
    public void removeSet(@RequestParam String name) { service.removeSet(name); }

    /**
     * NEW: Renames a set.
     */
    @PostMapping("/sets/rename")
    public void renameSet(@RequestParam String oldName, @RequestParam String newName) {
        service.renameSet(oldName, newName);
    }

    /**
     * NEW: Updates the full list of elements for a single set.
     */
    @PostMapping("/set/membership")
    public void setElementMembershipForSet(@RequestParam String name,
                                           @RequestParam(required = false) Set<String> elements) {
        service.setElementMembershipForSet(name, elements);
    }

    @PostMapping("/element")
    public void updateElementMembership(@RequestParam String name,
                                        @RequestParam(required = false) Set<String> sets) {
        service.updateElementMembership(name, sets);
    }

    @PostMapping("/element/delete")
    public void deleteElement(@RequestParam String name) {
        service.deleteElement(name);
    }

    @PostMapping("/element/rename")
    public void renameElement(@RequestParam String oldName, @RequestParam String newName) {
        service.renameElement(oldName, newName);
    }

    /**
     * Exception handler to send user-friendly error messages to the front-end.
     * (Method is unchanged)
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException ex) {
        // Return a 400 Bad Request status with the error message
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
}