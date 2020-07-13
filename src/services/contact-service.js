const EntityManager = require("../core/database/entity-manager");
const buildContactFilterQuery = require("./helpers/build-contact-filter-query");
const WeatherApiClient = require("./weather-api-client");

const modelName = 'Contact';

module.exports = {
    async getAll(rawQuery) {
        const em = new EntityManager();
        await em.loadEntity(modelName);

        const response = {
            done: true,
            contacts: [],
            errorMsg: ''
        };

        return em.find(buildContactFilterQuery(rawQuery))
            .then(results => {
                response.contacts = results;
                return response;
            })
            .catch(err => {
                response.done = false;
                response.errorMsg = err.message;
                return response;
            });
    },
    async createOne(data) {
        const em = new EntityManager();
        await em.loadEntity(modelName);

        const response = {
            done: false,
            errorMsg: ''
        };

        return em.create(data)
            .then(() => {
                response.done = true;
                return response;
            })
            .catch(err => {
                response.errorMsg = err.message;
                return response;
            });
    },

    async getOne(id) {
        const em = new EntityManager();
        await em.loadEntity(modelName);

        const response = {
            done: false,
            contact: null,
            errorMsg: ''
        };

        return em.getById(id)
            .then(result => {
                return JSON.parse(JSON.stringify(result));
            })
            .then(async contact => {
                response.contact = contact;
                response.done = true;

                if (!contact.address || !contact.address.city) {
                    return response;
                }

                const apiClient = new WeatherApiClient();
                response.contact.address.weatherData = await apiClient
                    .getWeatherDataByCity(contact.address.city);

                return response;
            })
            .catch(err => {
                response.errorMsg = err.message;
                return response;
            });
    },

    async updateOne(id, data) {
        const em = new EntityManager();
        await em.loadEntity(modelName);

        const response = {
            done: false,
            errorMsg: ''
        };

        return em.updateById(id, data)
            .then(() => {
                response.done = true;
                return response;
            })
            .catch(err => {
                response.errorMsg = err.message;
                return response;
            });
    },

    async removeOne(id) {
        const em = new EntityManager();
        await em.loadEntity(modelName);

        const response = {
            done: false,
            errorMsg: ''
        };

        return em.removeById(id)
            .then(() => {
                response.done = true;
                return response;
            })
            .catch(err => {
                response.errorMsg = err.message;
                return response;
            });
    }
};
