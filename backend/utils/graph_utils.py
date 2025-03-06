from typing import Dict, List

def detect_cycles(graph: Dict[int, List[int]]) -> List[List[int]]:
    
    def dfs(node, visited, stack, path, all_cycles):
        if node in stack:  # Cycle detected
            cycle_start = stack.index(node)
            cycle = path[cycle_start:] + [node]  # Extract full cycle
            if cycle not in all_cycles:  # Avoid duplicates
                all_cycles.append(cycle)
            return  # Continue DFS to find other cycles

        if node in visited:
            return  # Already processed node, no need to revisit

        visited.add(node)
        stack.append(node)
        path.append(node)

        for neighbor in graph.get(node, []):
            dfs(neighbor, visited, stack, path, all_cycles)

        stack.pop()
        path.pop()

    visited = set()
    all_cycles = []

    for task_id in graph:
        if task_id not in visited:
            dfs(task_id, visited, [], [], all_cycles)

    return all_cycles
