import { IndexPage } from './index';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Routes/Index',
  component: IndexPage,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof IndexPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Home route: centered card with Drizzle logo, "Todos Admin" title,
 * and FeatureInfo (about, key features, stack).
 */
export const Default: Story = {};
