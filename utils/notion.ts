import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.EXPO_PUBLIC_NOTION_KEY,
});

export const exportRecipeToNotion = async (recipe: {
  title: string;
  time: string;
  servings: number;
  ingredients: string[];
  instructions: string[];
}) => {
  try {
    const response = await notion.pages.create({
      parent: {
        database_id: process.env.EXPO_PUBLIC_NOTION_DATABASE_ID!,
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: recipe.title,
              },
            },
          ],
        },
        'Cooking Time': {
          rich_text: [
            {
              text: {
                content: recipe.time,
              },
            },
          ],
        },
        Servings: {
          number: recipe.servings,
        },
      },
      children: [
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'Ingredients' } }],
          },
        },
        ...recipe.ingredients.map((ingredient) => ({
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ type: 'text', text: { content: ingredient } }],
          },
        })),
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'Instructions' } }],
          },
        },
        ...recipe.instructions.map((instruction) => ({
          object: 'block',
          type: 'numbered_list_item',
          numbered_list_item: {
            rich_text: [{ type: 'text', text: { content: instruction } }],
          },
        })),
      ],
    });

    return response;
  } catch (error) {
    console.error('Error exporting to Notion:', error);
    throw error;
  }
};