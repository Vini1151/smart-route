#include <stdio.h>
#include <limits.h>
#include <string.h>

#define MAX 100

// Find minimum distance node
int minDistance(int dist[], int visited[], int n) {
    int min = INT_MAX, min_index = -1;

    for (int i = 0; i < n; i++) {
        if (!visited[i] && dist[i] < min) {
            min = dist[i];
            min_index = i;
        }
    }
    return min_index;
}

// Print path
void printPath(int prev[], int v, char cities[][20]) {
    if (prev[v] == -1) {
        printf("%s", cities[v]);
        return;
    }
    printPath(prev, prev[v], cities);
    printf(" -> %s", cities[v]);
}

// Dijkstra function
void dijkstra(int graph[MAX][MAX], int n, int src, int dest, char cities[][20]) {
    int dist[MAX], visited[MAX], prev[MAX];

    for (int i = 0; i < n; i++) {
        dist[i] = INT_MAX;
        visited[i] = 0;
        prev[i] = -1;
    }

    dist[src] = 0;

    for (int i = 0; i < n - 1; i++) {
        int u = minDistance(dist, visited, n);
        if (u == -1) break;

        visited[u] = 1;

        for (int v = 0; v < n; v++) {
            if (!visited[v] &&
                graph[u][v] != 0 &&
                dist[u] != INT_MAX &&
                dist[u] + graph[u][v] < dist[v]) {

                dist[v] = dist[u] + graph[u][v];
                prev[v] = u;
            }
        }
    }

    // If no path
    if (dist[dest] == INT_MAX) {
        printf("No path found\n");
        return;
    }

    // Output
    printf("Best Route: ");
    printPath(prev, dest, cities);
    printf("\nTotal Distance: %d km\n", dist[dest]);
}

// MAIN (reads input from JS)
int main() {
    int n, src, dest;
    char cities[MAX][20];
    int graph[MAX][MAX];

    // Read number of cities
    scanf("%d", &n);

    // Read city names
    for (int i = 0; i < n; i++) {
        scanf("%s", cities[i]);
    }

    // Read adjacency matrix
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            scanf("%d", &graph[i][j]);
        }
    }

    // Read source and destination index
    scanf("%d %d", &src, &dest);

    // Run algorithm
    dijkstra(graph, n, src, dest, cities);

    return 0;
}