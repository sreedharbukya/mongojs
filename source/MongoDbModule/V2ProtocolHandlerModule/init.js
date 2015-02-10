// protocol should be 'v2.mongodb' but websockify only understands 'binary'
(module.protocolHandlers = module.protocolHandlers || {}).binary = module