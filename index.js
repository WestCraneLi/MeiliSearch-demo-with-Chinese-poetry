const { MeiliSearch } = require('meilisearch')
const poetry = require('./dataset/poetry/唐诗三百首.json')

const client = new MeiliSearch({
    host: 'http://localhost:7700',
    apiKey: 'DHTtAiD22UxgIKhQwpS-EH5IcledknXII3KvwjkjdYI'
})
client.createIndex('poetry', { primaryKey: 'id' })
client.index('poetry').addDocuments(poetry)
    .then((res) => console.log(res))
