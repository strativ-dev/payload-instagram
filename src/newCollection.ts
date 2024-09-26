import { CollectionConfig } from 'payload/types'

const newCollection: CollectionConfig = {
  slug: 'instagram-collection',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    // {
    //   name: 'image',
    //   type: 'upload',
    //   relationTo: 'media',
    // },
    {
      name: 'additionalData',
      type: 'json',
    },
  ],
}

export default newCollection
