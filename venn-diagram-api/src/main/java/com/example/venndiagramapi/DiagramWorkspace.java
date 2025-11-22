package com.example.venndiagramapi;

import java.util.Objects;

/**
 * A wrapper class that holds a single VennDiagramModel and its metadata.
 * This allows us to manage multiple diagrams.
 * We use VennDiagramModel<Object> to support different data types.
 */
public class DiagramWorkspace {

    private final String diagramId;
    private String name;
    private final String elementType; // "STRING", "NUMBER", or "IMAGE_URL"
    private final VennDiagramModel<Object> model;

    public DiagramWorkspace(String diagramId, String name, String elementType) {
        this.diagramId = Objects.requireNonNull(diagramId);
        this.name = Objects.requireNonNull(name);
        this.elementType = Objects.requireNonNull(elementType);
        this.model = new VennDiagramModel<>();
    }

    // Getters
    public String getDiagramId() { return diagramId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getElementType() { return elementType; }
    public VennDiagramModel<Object> getModel() { return model; }

    /**
     * A simple "summary" class to send to the dashboard list,
     * so we don't send the entire (potentially huge) model.
     */
    public static class Summary {
        public String diagramId;
        public String name;
        public String elementType;

        public Summary(String diagramId, String name, String elementType) {
            this.diagramId = diagramId;
            this.name = name;
            this.elementType = elementType;
        }
    }

    public Summary getSummary() {
        return new Summary(this.diagramId, this.name, this.elementType);
    }
}