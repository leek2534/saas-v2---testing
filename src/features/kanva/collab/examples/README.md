# 📚 Kanva Collaboration Examples

This folder contains example implementations showing how to integrate collaboration into your Kanva editor.

## Files

### `ElementWithOperations.tsx`
Complete example of a collaborative Konva element with:
- ✅ Element locking on drag/transform
- ✅ Live drag streaming (throttled)
- ✅ Undoable operations
- ✅ Lock badges for visual feedback
- ✅ Disabled interaction for locked elements

**Use this as a template** for converting your existing elements.

## How to Use These Examples

### 1. Study the Pattern

Look at `ElementWithOperations.tsx` to understand:
- When to lock/unlock elements
- How to broadcast live updates
- How to make operations undoable
- How to show visual feedback

### 2. Apply to Your Elements

For each element type (Text, Image, Shape, etc.):
1. Add the collaboration hooks (`useLiveblocks`, `useCanvasCollab`)
2. Replace direct store updates with `applyLocal()`
3. Add locking on interaction start
4. Add unlock on interaction end
5. Add lock badges for visual feedback

### 3. Test Thoroughly

Open in 2 browsers and verify:
- [ ] Elements lock when being edited
- [ ] Other users see lock badges
- [ ] Live updates appear smoothly
- [ ] Undo only affects your own changes
- [ ] No conflicts or race conditions

## Common Patterns

### Lock on Start, Unlock on End
```typescript
onDragStart={() => {
  applyLocal({ type: 'element:lock', elementId, userId, userName, ts: Date.now() });
}}

onDragEnd={() => {
  applyLocal({ type: 'element:update', elementId, updates, userId, ts: Date.now(), undoable: true });
  applyLocal({ type: 'element:unlock', elementId, userId, ts: Date.now() });
}}
```

### Throttled Live Updates
```typescript
const dragBroadcast = useMemo(
  () => throttle((x, y) => {
    applyLocal({ type: 'element:drag', elementId, x, y, userId, ts: Date.now() });
  }, 40), // 25fps
  []
);
```

### Check if Locked
```typescript
const isLockedByOther = element.lockedBy && element.lockedBy !== userId;

<Element draggable={!isLockedByOther} />
```

## Next Steps

1. Convert one element type first (e.g., Rectangle)
2. Test it thoroughly
3. Apply the same pattern to other element types
4. Add text editing exclusivity (see main docs)
5. Implement undo/redo keyboard shortcuts

See `KANVA_COLLABORATION_IMPLEMENTATION.md` for complete documentation.
