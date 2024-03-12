#!/bin/bash
psql postgresql://nala:ladelpollodorado@localhost:5432/mydb << EOF
	UPDATE "Desk"
	SET "clientId" = NULL;

	DELETE FROM "Client";
	
	ALTER SEQUENCE "Client_id_seq" RESTART WITH 1;
EOF
