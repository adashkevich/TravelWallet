var $$ = Dom7,
    endpoint = 'localhost';

var app = new Framework7({
    root: '#app',
    name: 'TravelWallet',
    id: 'com.adashkevich.phonegap.travelwallet',
    version: '1.0.0',
    panel: {
        swipe: 'left'
    },

    routes: [
        {
            path: '/login-screen/',
            loginScreen: {
                componentUrl: './pages/login-screen.html'
            }
        },
        {
            path: '/debt/list/',
            componentUrl: './pages/debt/list.html'
        },
        {
            path: '/debt/new/',
            componentUrl: './pages/debt/new.html'
        },
        {
            path: '/debt/edit/:debt_id/',
            componentUrl: './pages/debt/edit.html'
        },
        {
            path: '/debt/show/:debt_id/',
            componentUrl: './pages/debt/show.html',
            tabs: [
                {
                    path: '/',
                    id: 'payments',
                    componentUrl: './pages/payment/list.html'
                },
                {
                    path: '/calculations/',
                    id: 'calculation',
                    componentUrl: './pages/payment/calculation.html'
                },
                {
                    path: '/details/',
                    id: 'details',
                    componentUrl: './pages/payment/details.html'
                }
            ]
        },
        {
            path: '/payment/new/:debt_id/',
            componentUrl: './pages/payment/new.html'
        },
        {
            path: '/payment/edit/:payment_id/',
            componentUrl: './pages/payment/edit.html'
        },
        {
            path: '/profile/edit/',
            componentUrl: './pages/profile/edit.html'
        },
        {
            path: '/currency/list/',
            componentUrl: './pages/currency/list.html'
        }
    ],
    data: function () {
        return {
            users: [],
            debts: [],
            payments: [],
            archived_debts: [],
            currencies: [],
            currency_rates: [],
            locale_str: utils.localeStr(),
            device: app.device
        };
    }
});

app.views.create('.view-main');

function initAppData() {

    service.init.add(service.user.list, function (users) {
        app.data.users = users;
        service.init.finish('users');
    }, 'users');

    service.init.add(service.auth.getLogIn, function (details) {
        if(details) {
            app.data.current_user = service.user.get(details.user_id);
        }
        service.init.finish('current_user');
    }, 'current_user', ['users']);

    service.init.add(function () {
        if (!app.data.current_user) {
            // TODO remove hot fix
            // app.views.current.router.navigate('/login-screen/', {
            //     animate: false
            // });

            service.auth.logIn({id: utils.uuid(), phone: '', auth_token: utils.uuid(), ava: service.image.predefined().random()}, function () {
                service.init.finish('login');
            });
        } else {
            service.init.finish('login');
        }
    }, [], 'login', ['current_user']);

    service.init.add(function () {
        if (!app.data.current_user.name) {
            app.views.current.router.navigate('/profile/edit/', {
                animate: false
            });
        } else {
            service.init.finish('profile');
        }
    }, [], 'profile', ['login']);

    service.init.add(service.currency.list, function (currencies) {
        app.data.currencies = currencies;
        service.init.finish('currency');
    }, 'currency');

    service.init.add(service.currency.rateList, function (currency_rates) {
        app.data.currency_rates = currency_rates;
        service.init.finish('currency_rates');
    }, 'currency_rates');

    service.init.add(service.payment.list, function (payments) {
        app.data.payments = payments;
        service.init.finish('payments');
    }, 'payments');

    service.init.add(service.debt.list, ['active', function (debts) {
        app.data.debts = debts;
        service.init.finish('debt');
    }], 'debt');

    // TODO remove hot fix
    // var finishSync = service.init.finish.bind({}, 'sync');
    // service.init.add(service.sync.start, [finishSync, finishSync], 'sync', ['users', 'payments', 'debt', 'login', 'sync_contacts']);

    // TODO remove hot fix
    // var finishSyncContacts = service.init.finish.bind({}, 'sync_contacts');
    // service.init.add(service.user.sync_w_device, [finishSyncContacts, finishSyncContacts], 'sync_contacts', ['users']);

    service.init.start(function () {
        console.log('start');
        app.views.current.router.navigate('/debt/list/', {
            animate: false
        });
    });
}

$$(document).once('page:init', '.page[data-name="init"]', function (e) {
    initAppData();
    initPopups();
});

//Wrong submit fix
$$(document).on('submit', 'form', function (e) {
    e.preventDefault();
});