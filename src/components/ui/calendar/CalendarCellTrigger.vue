<script setup>
import { reactiveOmit } from '@vueuse/core';
import { CalendarCellTrigger, useForwardProps } from 'reka-ui';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

const props = defineProps({
  day: { type: null, required: true },
  month: { type: null, required: true },
  asChild: { type: Boolean, required: false },
  as: { type: null, required: false, default: 'button' },
  class: {
    type: [Boolean, null, String, Object, Array],
    required: false,
    skipCheck: true,
  },
});

const delegatedProps = reactiveOmit(props, 'class');

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <CalendarCellTrigger
    data-slot="calendar-cell-trigger"
    :class="
      cn(
        buttonVariants({ variant: 'ghost' }),
        'size-8 p-0 font-normal aria-selected:opacity-100 cursor-default',
        '[&[data-today]:not([data-selected])]:bg-accent [&[data-today]:not([data-selected])]:text-accent-foreground',
        // Selected
        'data-selected:shadow-[5px_5px_15px_#d9d5ce,-5px_-5px_15px_#ffffff] data-selected:font-bold',
        'data-selected:bg-amber-200 data-selected:opacity-100 [&[data-selected]:hover]:bg-amber-400',
        // Disabled
        'data-[disabled]:text-muted-foreground data-[disabled]:opacity-50',
        // Unavailable
        'data-[unavailable]:text-destructive-foreground data-[unavailable]:line-through',
        // Outside months
        'data-[outside-view]:text-muted-foreground',
        props.class
      )
    "
    v-bind="forwardedProps"
  >
    <slot />
  </CalendarCellTrigger>
</template>
