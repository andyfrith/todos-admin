import FeatureInfo from './FeatureInfo';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Todos/FeatureInfo',
  component: FeatureInfo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FeatureInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Application summary card: name, purpose, key features, and tech stack.
 * Renders with default static content.
 */
export const Default: Story = {};
