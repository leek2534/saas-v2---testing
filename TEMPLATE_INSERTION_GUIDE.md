# Template Insertion System - Implementation Guide

## Overview

Templates are **blueprints** that create actual editable nodes in the tree. They are NOT rendered as single components.

---

## How It Works

### 1. Template Structure

Templates define a complete node hierarchy:

```typescript
{
  id: 'hero-centered-1',
  name: 'Centered Hero',
  structure: {
    type: 'section',
    props: {
      background: '#ffffff',
      padding: { top: 60, bottom: 60, left: 20, right: 20 }
    },
    children: [
      {
        type: 'row',
        props: { gap: 16 },
        children: [
          {
            type: 'column',
            props: { width: 'auto' },
            children: [
              {
                type: 'element',
                props: {
                  kind: 'heading',
                  content: { /* TipTap JSON */ },
                  fontSize: 48,
                  textAlign: 'center'
                }
              },
              {
                type: 'element',
                props: {
                  kind: 'paragraph',
                  content: { /* TipTap JSON */ },
                  fontSize: 18,
                  textAlign: 'center'
                }
              },
              {
                type: 'element',
                props: {
                  kind: 'button',
                  text: 'Get Started',
                  style: 'primary'
                }
              }
            ]
          }
        ]
      }
    ]
  }
}
```

### 2. Insertion Process

When user clicks a template in the Blocks tab:

```typescript
// 1. Get template structure
const template = getTemplateById('hero-centered-1');

// 2. Call store method to insert
store.insertTemplate(template.structure);

// 3. Store creates actual nodes:
//    - Generates unique IDs for each node
//    - Creates SectionNode, RowNode, ColumnNode, ElementNodes
//    - Links them with parent/child relationships
//    - Adds to tree.nodes and tree.pageRootIds

// 4. Canvas automatically re-renders
//    - Each element renders independently
//    - User can click any element to edit
//    - Inspector shows element-specific settings
```

### 3. Store Method Needed

Add to `store.ts`:

```typescript
insertTemplate: (structure: TemplateStructure) => {
  set((state) => {
    const newTree = { ...state.tree };
    const newNodes = { ...newTree.nodes };
    
    // Recursive function to create nodes
    function createNode(template: any, parentId?: string): string {
      const nodeId = id(); // Generate unique ID
      
      if (template.type === 'section') {
        const section: SectionNode = {
          id: nodeId,
          type: 'section',
          parentId: null,
          props: template.props || {},
          children: []
        };
        
        // Create children
        if (template.children) {
          template.children.forEach((child: any) => {
            const childId = createNode(child, nodeId);
            section.children.push(childId);
          });
        }
        
        newNodes[nodeId] = section;
        newTree.pageRootIds.push(nodeId); // Add to page
        
      } else if (template.type === 'row') {
        const row: RowNode = {
          id: nodeId,
          type: 'row',
          parentId: parentId!,
          props: template.props || {},
          children: []
        };
        
        if (template.children) {
          template.children.forEach((child: any) => {
            const childId = createNode(child, nodeId);
            row.children.push(childId);
          });
        }
        
        newNodes[nodeId] = row;
        
      } else if (template.type === 'column') {
        const column: ColumnNode = {
          id: nodeId,
          type: 'column',
          parentId: parentId!,
          props: template.props || {},
          children: []
        };
        
        if (template.children) {
          template.children.forEach((child: any) => {
            const childId = createNode(child, nodeId);
            column.children.push(childId);
          });
        }
        
        newNodes[nodeId] = column;
        
      } else if (template.type === 'element') {
        const element: ElementNode = {
          id: nodeId,
          type: 'element',
          parentId: parentId!,
          props: template.props
        };
        
        newNodes[nodeId] = element;
      }
      
      return nodeId;
    }
    
    // Create all nodes from template
    createNode(structure);
    
    newTree.nodes = newNodes;
    return { tree: newTree };
  });
}
```

---

## Current vs Proper Implementation

### Current (Wrong):
```typescript
// Template only has element props
{ kind: 'hero', headline: 'Welcome' }
    ↓
// Renders as single Hero mockup component
<HeroMockup props={...} />
    ↓
// User can't edit individual parts
```

### Proper (Correct):
```typescript
// Template has full structure
{ type: 'section', children: [row → column → [heading, paragraph, button]] }
    ↓
// Creates actual nodes in tree
SectionNode → RowNode → ColumnNode → [HeadingElement, ParagraphElement, ButtonElement]
    ↓
// Each element renders independently
<Heading />, <Paragraph />, <Button />
    ↓
// User can click and edit each one
```

---

## Benefits

### ✅ Full Editability
- Every text, button, image is independently editable
- User can delete, move, or modify any part
- Inspector shows settings for selected element

### ✅ Flexibility
- User can add more elements to template
- Can change layout after insertion
- Not locked into template structure

### ✅ Consistency
- Templates use same elements as manual building
- No special "template mode" needed
- Works with existing editor features

---

## Implementation Steps

### Step 1: Update Template Definitions
Change templates to define full node structures instead of just element props.

### Step 2: Add insertTemplate Method
Add method to Zustand store that creates nodes from template structure.

### Step 3: Update BlocksTab
Change template buttons to call `insertTemplate()` instead of `addElement()`.

### Step 4: Test
- Click template → Should create multiple nodes
- Click any element → Should be editable
- Inspector → Should show element settings

---

## Example: Hero Template

### Template Definition:
```typescript
{
  id: 'hero-centered-1',
  name: 'Centered Hero with Image',
  structure: {
    type: 'section',
    props: { background: '#f9fafb', padding: { top: 80, bottom: 80 } },
    children: [{
      type: 'row',
      children: [{
        type: 'column',
        props: { width: 'auto' },
        children: [
          { type: 'element', props: { kind: 'heading', content: defaultDoc('Welcome') } },
          { type: 'element', props: { kind: 'paragraph', content: defaultDoc('Description') } },
          { type: 'element', props: { kind: 'button', text: 'Get Started' } }
        ]
      }]
    }]
  }
}
```

### After Insertion:
```
tree.nodes = {
  'sec-abc': { type: 'section', children: ['row-def'], props: {...} },
  'row-def': { type: 'row', parentId: 'sec-abc', children: ['col-ghi'], props: {...} },
  'col-ghi': { type: 'column', parentId: 'row-def', children: ['elem-1', 'elem-2', 'elem-3'], props: {...} },
  'elem-1': { type: 'element', parentId: 'col-ghi', props: { kind: 'heading', ... } },
  'elem-2': { type: 'element', parentId: 'col-ghi', props: { kind: 'paragraph', ... } },
  'elem-3': { type: 'element', parentId: 'col-ghi', props: { kind: 'button', ... } }
}

tree.pageRootIds = ['sec-abc', ...other sections]
```

### On Canvas:
- Section renders with background and padding
- Row renders with gap
- Column renders with width
- Each element renders independently:
  - Heading: User can click to edit text
  - Paragraph: User can click to edit text
  - Button: User can click to edit text/style

---

## Next Steps

1. **Add `insertTemplate` method to store** - Core functionality
2. **Update template definitions** - Add full structures
3. **Update BlocksTab** - Call new method
4. **Test end-to-end** - Verify editability

This approach gives users the **power of templates** with the **flexibility of custom building**.
