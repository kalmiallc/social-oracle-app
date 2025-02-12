<template>
  <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
      <div>
        <p class="text-sm">
          Showing page
          <span class="font-medium">{{ currentPage + 1 }}</span>
          of
          <span class="font-medium">{{ availablePages }}</span>
        </p>
      </div>
      <div>
        <nav
          class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px rounded-l-md border border-gray-300 overflow-hidden"
          aria-label="Pagination"
        >
          <a
            @click.prevent="back()"
            v-if="currentPage - 1 >= 0"
            class="cursor-pointer relative inline-flex items-center px-2 py-2 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <span class="sr-only">Previous</span>
            <!-- Heroicon name: solid/chevron-left -->
            <svg
              class="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </a>
          <a
            v-for="page in availablePages"
            :key="page"
            @click.prevent="loadPage(page - 1)"
            :class="page - 1 == currentPage ? 'bg-gray-100' : ''"
            class="cursor-pointer relative inline-flex items-center px-4 py-2 bg-white text-sm font-medium hover:bg-gray-50"
          >
            {{ page }}
          </a>
          <a
            @click.prevent="next()"
            v-if="currentPage + 1 <= availablePages - 1"
            class="cursor-pointer relative inline-flex items-center px-2 py-2 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <span class="sr-only">Next</span>
            <!-- Heroicon name: solid/chevron-right -->
            <svg
              class="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </a>
        </nav>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>
